import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams
    .get("username")
    ?.trim()
    .replace(/^@/, "");

  if (!username) {
    return NextResponse.json(
      {
        error: "Username is required",
      },
      {
        status: 400,
      }
    );
  }

  const bearerToken = process.env.X_BEARER_TOKEN;

  /*
   * Official X API
   */

  if (bearerToken) {
    try {
      const response = await fetch(
        `https://api.x.com/2/users/by/username/${encodeURIComponent(
          username
        )}?user.fields=profile_image_url,name,username,description`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },

          cache: "no-store",
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result?.data) {
          let avatar =
            result.data.profile_image_url || "";

          avatar = avatar.replace("_normal.", ".");

          return NextResponse.json({
            source: "x-api",
            username:
              result.data.username || username,
            name:
              result.data.name || username,
            avatar,
            description:
              result.data.description || "",
          });
        }
      }
    } catch (error) {
      console.error(
        "X API error:",
        error
      );
    }
  }

  /*
   * Fallback
   */

  return NextResponse.json({
    source: "unavatar",
    username,
    name: username,
    avatar: `https://unavatar.io/x/${encodeURIComponent(
      username
    )}`,
    description: "",
  });
}