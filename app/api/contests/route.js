import { NextResponse } from "next/server";
import { getCachedData, setCachedData } from "./cache";

export async function GET() {
  try {
    // STEP 1: Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      console.log("CACHE HIT");
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    // STEP 2: Cache miss → fetch all contests
    console.log("CACHE MISS → fetching fresh data");
    const contests = await fetchAllContests();

    const response = {
      success: true,
      contests,
      lastUpdated: new Date().toISOString(),
    };

    // STEP 3: Store result in cache
    setCachedData(response);

    return NextResponse.json({
      ...response,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contests",
      },
      { status: 500 }
    );
  }
}


async function fetchAllContests() {
  const results = await Promise.allSettled([
    fetchCodeChef(),
    fetchCodeforces(),
    fetchGeeksforGeeks(),
    fetchLeetCode(),
    fetchHackerEarth(),
    fetchAtCoder(),      
    /* fetchTopCoder(), */       
    fetchHackerRank(),   
    fetchClist(),         
    fetchSPOJ()         
  ]);

  return results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
}

async function fetchCodeChef() {
  try {
    const res = await fetch(
      "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc",
      {
        cache: "no-store",
      },
    );
    const data = await res.json();
    const contestsData = [
      ...(data.present_contests || []),
      ...(data.future_contests || []),
    ];

    return contestsData.map((c) => ({
      id: `codechef-${c.contest_code}`,
      platform: "CodeChef",
      title: c.contest_name,
      url: `https://www.codechef.com/${c.contest_code}`,
      start_time: new Date(c.contest_start_date_iso).toISOString(),
      duration: Math.floor(
        (new Date(c.contest_end_date_iso) -
          new Date(c.contest_start_date_iso)) /
          1000,
      ),
    }));
  } catch (error) {
    console.error("CodeChef fetch error:", error);
    return [];
  }
}

async function fetchCodeforces() {
  try {
    const res = await fetch("https://codeforces.com/api/contest.list", {
      cache: "no-store",
    });
    const data = await res.json();
    const now = Date.now() / 1000;

    return data.result
      .filter((c) => c.startTimeSeconds + c.durationSeconds > now)
      .map((c) => ({
        id: `codeforces-${c.id}`,
        platform: "Codeforces",
        title: c.name,
        url: `https://codeforces.com/contests/${c.id}`,
        start_time: new Date(c.startTimeSeconds * 1000).toISOString(),
        duration: c.durationSeconds,
      }));
  } catch (error) {
    console.error("Codeforces fetch error:", error);
    return [];
  }
}

async function fetchGeeksforGeeks() {
  try {
    const res = await fetch(
      "https://practiceapi.geeksforgeeks.org/api/vr/events/?type=contest&sub_type=upcoming",
      {
        cache: "no-store",
      },
    );
    const data = await res.json();

    return (data.results?.upcoming || []).map((c) => ({
      id: `gfg-${c.slug}`,
      platform: "GeeksforGeeks",
      title: c.name,
      url: `https://practice.geeksforgeeks.org/contest/${c.slug}`,
      start_time: new Date(c.start_time).toISOString(),
      duration: Math.floor(
        (new Date(c.end_time) - new Date(c.start_time)) / 1000,
      ),
    }));
  } catch (error) {
    console.error("GeeksforGeeks fetch error:", error);
    return [];
  }
}

async function fetchLeetCode() {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{ allContests { title titleSlug startTime duration } }`,
      }),
      cache: "no-store",
    });
    const data = await res.json();
    const now = Date.now() / 1000;

    return (data.data?.allContests || [])
      .filter((c) => c.startTime + c.duration > now)
      .map((c) => ({
        id: `leetcode-${c.titleSlug}`,
        platform: "LeetCode",
        title: c.title,
        url: `https://leetcode.com/contest/${c.titleSlug}`,
        start_time: new Date(c.startTime * 1000).toISOString(),
        duration: c.duration,
      }));
  } catch (error) {
    console.error("LeetCode fetch error:", error);
    return [];
  }
}

async function fetchHackerEarth() {
  try {
    const res = await fetch(
      "https://www.hackerearth.com/challenges/competitive/",
      {
        cache: "no-store",
      },
    );
    const html = await res.text();
    const slugMatches = html.matchAll(
      /\/challenges\/competitive\/([^\/'"]+)\//g,
    );
    const slugs = [...new Set([...slugMatches].map((m) => m[1]))];

    const contests = [];
    for (const slug of slugs.slice(0, 10)) {
      try {
        const detailsRes = await fetch(
          `https://www.hackerearth.com/challengesapp/api/events/${slug}/?only_meta=false`,
          {
            cache: "no-store",
          },
        );
        const details = await detailsRes.json();

        const startDate = new Date(details.start_date);
        const endDate = new Date(details.end_date);

        if (endDate <= new Date()) continue;

        contests.push({
          id: `hackerearth-${slug}`,
          platform: "HackerEarth",
          title: details.title || details.name,
          url: `https://www.hackerearth.com/challenges/competitive/${slug}/`,
          start_time: startDate.toISOString(),
          duration: Math.floor((endDate - startDate) / 1000),
        });
      } catch (error) {
        console.error(`HackerEarth contest ${slug} error:`, error);
      }
    }
    return contests;
  } catch (error) {
    console.error("HackerEarth fetch error:", error);
    return [];
  }
}

async function fetchAtCoder() {
  try {
    const res = await fetch("https://atcoder.jp/contests/?lang=en", {
      cache: "no-store",
    });
    const html = await res.text();

    // Parse upcoming contests table
    const contests = [];
    const tableRegex = /<tbody>([\s\S]*?)<\/tbody>/g;
    const rowRegex =
      /<tr>[\s\S]*?<td class="text-center">.*?<\/td>[\s\S]*?<td class="text-center"><a href="\/contests\/([^"]+)">([^<]+)<\/a><\/td>[\s\S]*?<td class="text-center"><time[^>]*>([^<]+)<\/time><\/td>[\s\S]*?<td class="text-center">(\d+):(\d+)<\/td>/g;

    const tables = [...html.matchAll(tableRegex)];
    if (tables[1]) {
      // Second table is upcoming contests
      const matches = [...tables[1][1].matchAll(rowRegex)];

      for (const match of matches) {
        const [, contestId, title, startTime, hours, minutes] = match;
        const duration = parseInt(hours) * 3600 + parseInt(minutes) * 60;

        contests.push({
          id: `atcoder-${contestId}`,
          platform: "AtCoder",
          title: title.trim(),
          url: `https://atcoder.jp/contests/${contestId}`,
          start_time: new Date(startTime).toISOString(),
          duration,
        });
      }
    }

    return contests;
  } catch (error) {
    console.error("AtCoder fetch error:", error);
    return [];
  }
}

async function fetchTopCoder() {
  try {
    const res = await fetch(
      "https://api.topcoder.com/v5/challenges?status=Active&tracks[]=Dev&tracks[]=DS",
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    );
    const data = await res.json();

    return (data || [])
      .filter((c) => c.currentPhases && c.currentPhases.length > 0)
      .map((c) => {
        const phase = c.currentPhases[0];
        return {
          id: `topcoder-${c.id}`,
          platform: "TopCoder",
          title: c.name,
          url: `https://www.topcoder.com/challenges/${c.id}`,
          start_time: new Date(phase.scheduledStartDate).toISOString(),
          duration: Math.floor(
            (new Date(phase.scheduledEndDate) -
              new Date(phase.scheduledStartDate)) /
              1000,
          ),
        };
      });
  } catch (error) {
    console.error("TopCoder fetch error:", error);
    return [];
  }
}

async function fetchHackerRank() {
  try {
    const res = await fetch(
      "https://www.hackerrank.com/rest/contests/upcoming?offset=0&limit=20",
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    );
    const data = await res.json();

    return (data.models || []).map((c) => ({
      id: `hackerrank-${c.slug}`,
      platform: "HackerRank",
      title: c.name,
      url: `https://www.hackerrank.com/contests/${c.slug}`,
      start_time: new Date(c.epoch_starttime * 1000).toISOString(),
      duration: c.epoch_endtime - c.epoch_starttime,
    }));
  } catch (error) {
    console.error("HackerRank fetch error:", error);
    return [];
  }
}

async function fetchClist() {
  try {

    const res = await fetch(
      "https://clist.by/api/v4/contest/?upcoming=true&format_time=true&limit=100&order_by=start",
      {
        cache: "no-store",
        headers: {
          Authorization:
            "ApiKey debjyoti_018:d951bbdbb021c2a5723761340bcf7c3788e6d7bb",
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) {
      console.log("CLIST API requires authentication - skipping");
      return [];
    }

    const data = await res.json();

    return (data.objects || [])
      .filter((c) => ["SPOJ", "CodeSignal", "TechGig"].includes(c.resource))
      .map((c) => ({
        id: `clist-${c.id}`,
        platform: c.resource,
        title: c.event,
        url: c.href,
        start_time: new Date(c.start).toISOString(),
        duration: c.duration,
      }));
  } catch (error) {
    console.error("CLIST fetch error:", error);
    return [];
  }
}


async function fetchSPOJ() {
  try {
    const res = await fetch('https://www.spoj.com/contests/', {
      cache: 'no-store'
    });
    const html = await res.text();
    
    const contests = [];
    const rowRegex = /<tr>[\s\S]*?<td><a href="\/([^"]+)\/">([^<]+)<\/a><\/td>[\s\S]*?<td>([^<]+)<\/td>[\s\S]*?<td>([^<]+)<\/td>/g;
    
    const matches = [...html.matchAll(rowRegex)];
    
    for (const match of matches) {
      const [, contestId, title, startTime] = match;
      
      if (new Date(startTime) > new Date()) {
        contests.push({
          id: `spoj-${contestId}`,
          platform: 'SPOJ',
          title: title.trim(),
          url: `https://www.spoj.com/${contestId}/`,
          start_time: new Date(startTime).toISOString(),
          duration: 0
        });
      }
    }
    
    return contests;
  } catch (error) {
    console.error('SPOJ fetch error:', error);
    return [];
  }
}