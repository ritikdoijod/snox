import { auth } from "@/lib/auth";

export const memberLoader = auth(async function ({
  params: { memberId },
  fc,
}) {
  const { member } = await fc.get(`/members/${memberId}`);

  return { member };
});


export const createTaskLoader = auth(async function ({fc}) {
  fc.get("/members")
})