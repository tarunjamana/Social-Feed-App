import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prismaClient = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prismaClient.comment.deleteMany();
  await prismaClient.like.deleteMany();
  await prismaClient.follow.deleteMany();
  await prismaClient.post.deleteMany();
  await prismaClient.refreshToken.deleteMany();
  await prismaClient.user.deleteMany();

  console.log("Cleared existing data");

  const [alex, sara, maya, nico, tarun] = await Promise.all([
    prismaClient.user.create({
      data: {
        username: "alexkim",
        email: "alex@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        displayName: "Alex Kim",
        bio: "Frontend dev. Building in public.",
      },
    }),
    prismaClient.user.create({
      data: {
        username: "sara_r",
        email: "sara@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        displayName: "Sara R",
        bio: "Fullstack engineer. GraphQL enthusiast.",
      },
    }),
    prismaClient.user.create({
      data: {
        username: "maya_n",
        email: "maya@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        displayName: "Maya N",
        bio: "Backend dev. Postgres and Prisma fan.",
      },
    }),
    prismaClient.user.create({
      data: {
        username: "nico_b",
        email: "nico@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        displayName: "Nico B",
        bio: "DevOps and cloud infrastructure.",
      },
    }),
    prismaClient.user.create({
      data: {
        username: "tarunjamana",
        email: "tarunjamana8469@gmail.com",
        passwordHash: await bcrypt.hash("gathrika", 10),
        displayName: "Tarun J",
        bio: "Frontend dev learning fullstack. Building a social feed app.",
      },
    }),
  ]);

  console.log("Created 4 users");

  const posts = await Promise.all([
    // Alex's posts (0-5)
    prismaClient.post.create({ data: { content: "Just shipped the new refactor. Feels incredible on the other side. Ship it!", authorId: alex.id } }),
    prismaClient.post.create({ data: { content: "TypeScript strict mode is non-negotiable. Turn it on from day one.", authorId: alex.id } }),
    prismaClient.post.create({ data: { content: "React Server Components are finally starting to click for me. The mental model is different but powerful.", authorId: alex.id } }),
    prismaClient.post.create({ data: { content: "Hot take: a well-named variable is worth more than a comment.", authorId: alex.id } }),
    prismaClient.post.create({ data: { content: "Just hit 100 commits on this project. Consistency beats intensity every time.", authorId: alex.id } }),
    prismaClient.post.create({ data: { content: "Tailwind CSS v4 is a game changer. The new Vite plugin setup is so clean.", authorId: alex.id } }),

    // Sara's posts (6-11)
    prismaClient.post.create({ data: { content: "GraphQL subscriptions are genuinely underrated for real-time UIs. The mental model is so much cleaner than polling.", authorId: sara.id } }),
    prismaClient.post.create({ data: { content: "Apollo Client's InMemoryCache is magic until it isn't. Always normalize your data.", authorId: sara.id } }),
    prismaClient.post.create({ data: { content: "Cursor-based pagination > offset pagination. Always. Especially on live feeds.", authorId: sara.id } }),
    prismaClient.post.create({ data: { content: "Writing a GraphQL schema first forces you to think about your API contract before implementation. Love it.", authorId: sara.id } }),
    prismaClient.post.create({ data: { content: "JWT refresh token rotation is one of those things that sounds complex but makes total sense once you implement it.", authorId: sara.id } }),
    prismaClient.post.create({ data: { content: "Context middleware is the unsung hero of every GraphQL API. One function, runs on every request.", authorId: sara.id } }),

    // Maya's posts (12-17)
    prismaClient.post.create({ data: { content: "Prisma + Postgres is an unbeatable combo. End-to-end type safety without the boilerplate.", authorId: maya.id } }),
    prismaClient.post.create({ data: { content: "Always add indexes to foreign keys. Learned this the hard way at scale.", authorId: maya.id } }),
    prismaClient.post.create({ data: { content: "Docker Compose for local dev is one of those things you can't imagine working without once you start.", authorId: maya.id } }),
    prismaClient.post.create({ data: { content: "The @@unique constraint in Prisma saved me from writing so much validation logic. Let the DB handle it.", authorId: maya.id } }),
    prismaClient.post.create({ data: { content: "Prisma migrations give you a full history of your schema changes. Treat them like Git commits — meaningful names matter.", authorId: maya.id } }),
    prismaClient.post.create({ data: { content: "Redis pub/sub is the cleanest way to fan out events to GraphQL subscriptions. Can't wait to implement it.", authorId: maya.id } }),

    // Nico's posts (18-24)
    prismaClient.post.create({ data: { content: "Running your dev infrastructure in Docker means zero 'works on my machine' problems. Just use it.", authorId: nico.id } }),
    prismaClient.post.create({ data: { content: "Named volumes in Docker Compose are a must. Containers are ephemeral, your data shouldn't be.", authorId: nico.id } }),
    prismaClient.post.create({ data: { content: "Environment variables in .env files should never be committed. Ever. Use .gitignore from day one.", authorId: nico.id } }),
    prismaClient.post.create({ data: { content: "bcrypt salt rounds at 10 is the sweet spot. High enough to be secure, low enough not to tank your server.", authorId: nico.id } }),
    prismaClient.post.create({ data: { content: "Health check endpoints are not optional. Every service should have one.", authorId: nico.id } }),
    prismaClient.post.create({ data: { content: "Monorepo structure makes sense once your frontend and backend share types. Start thinking about it early.", authorId: nico.id } }),
    prismaClient.post.create({ data: { content: "The best time to set up your folder structure is before you have too many files. The second best time is now.", authorId: nico.id } }),

    // Tarun's posts (25-27)
    prismaClient.post.create({ data: { content: "Building a social feed app with React, TypeScript, and GraphQL. Taking it one feature at a time.", authorId: tarun.id } }),
    prismaClient.post.create({ data: { content: "Infinite scroll with IntersectionObserver is one of those things that looks simple but has a lot of edge cases.", authorId: tarun.id } }),
    prismaClient.post.create({ data: { content: "Just implemented cursor-based pagination. The difference from offset pagination finally makes sense to me.", authorId: tarun.id } }),
  ]);

  console.log(`Created ${posts.length} posts`);

  await Promise.all([
    // Alex likes Sara and Maya's posts
    prismaClient.like.create({ data: { userId: alex.id, postId: posts[6]!.id } }),
    prismaClient.like.create({ data: { userId: alex.id, postId: posts[7]!.id } }),
    prismaClient.like.create({ data: { userId: alex.id, postId: posts[12]!.id } }),
    prismaClient.like.create({ data: { userId: alex.id, postId: posts[13]!.id } }),
    prismaClient.like.create({ data: { userId: alex.id, postId: posts[18]!.id } }),

    // Sara likes Alex and Nico's posts
    prismaClient.like.create({ data: { userId: sara.id, postId: posts[0]!.id } }),
    prismaClient.like.create({ data: { userId: sara.id, postId: posts[1]!.id } }),
    prismaClient.like.create({ data: { userId: sara.id, postId: posts[19]!.id } }),
    prismaClient.like.create({ data: { userId: sara.id, postId: posts[20]!.id } }),
    prismaClient.like.create({ data: { userId: sara.id, postId: posts[21]!.id } }),

    // Maya likes Alex and Sara's posts
    prismaClient.like.create({ data: { userId: maya.id, postId: posts[0]!.id } }),
    prismaClient.like.create({ data: { userId: maya.id, postId: posts[2]!.id } }),
    prismaClient.like.create({ data: { userId: maya.id, postId: posts[8]!.id } }),
    prismaClient.like.create({ data: { userId: maya.id, postId: posts[9]!.id } }),
    prismaClient.like.create({ data: { userId: maya.id, postId: posts[10]!.id } }),

    // Nico likes everyone's posts
    prismaClient.like.create({ data: { userId: nico.id, postId: posts[0]!.id } }),
    prismaClient.like.create({ data: { userId: nico.id, postId: posts[3]!.id } }),
    prismaClient.like.create({ data: { userId: nico.id, postId: posts[6]!.id } }),
    prismaClient.like.create({ data: { userId: nico.id, postId: posts[11]!.id } }),
    prismaClient.like.create({ data: { userId: nico.id, postId: posts[12]!.id } }),
    prismaClient.like.create({ data: { userId: nico.id, postId: posts[15]!.id } }),
  ]);

  console.log("Created likes");

  // Follows — tarun follows sara and maya
  await Promise.all([
    prismaClient.follow.create({ data: { followerId: tarun.id, followingId: sara.id } }),
    prismaClient.follow.create({ data: { followerId: tarun.id, followingId: maya.id } }),
    prismaClient.follow.create({ data: { followerId: sara.id, followingId: tarun.id } }),
    prismaClient.follow.create({ data: { followerId: alex.id, followingId: tarun.id } }),
  ]);

  console.log("Created follows");

  // Comments
  await Promise.all([
    // Tarun comments on Sara and Maya's posts
    prismaClient.comment.create({ data: { content: "This is exactly what I needed to read today. GraphQL subscriptions are next on my list.", authorId: tarun.id, postId: posts[6]!.id } }),
    prismaClient.comment.create({ data: { content: "Cursor pagination was confusing at first but now I totally get it.", authorId: tarun.id, postId: posts[8]!.id } }),
    prismaClient.comment.create({ data: { content: "Prisma + Postgres has been my stack for this project too. Loving it.", authorId: tarun.id, postId: posts[12]!.id } }),

    // Sara comments on Tarun's posts
    prismaClient.comment.create({ data: { content: "Love seeing someone build in public. Keep going!", authorId: sara.id, postId: posts[25]!.id } }),
    prismaClient.comment.create({ data: { content: "The stale closure issue with IntersectionObserver is a classic. Glad you figured it out.", authorId: sara.id, postId: posts[26]!.id } }),

    // Maya comments on various posts
    prismaClient.comment.create({ data: { content: "Agreed. Once you go cursor pagination you never go back.", authorId: maya.id, postId: posts[8]!.id } }),
    prismaClient.comment.create({ data: { content: "The ref pattern for avoiding stale closures is underrated.", authorId: maya.id, postId: posts[27]!.id } }),

    // Alex comments
    prismaClient.comment.create({ data: { content: "Solid take. This is how I learned too — by building.", authorId: alex.id, postId: posts[25]!.id } }),
  ]);

  console.log("Created comments");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
