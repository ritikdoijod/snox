import { Member } from "@/models/member";
import { AppEvent } from "@/models/event";

export async function getEvents(c) {
  const {
    include,
    filters: { workspace, ...filters },
    sort,
    fields,
    size,
    page,
  } = c?.query;

  const memberships = await Member.find({ user: c.user.id, workspace });

  const workspaces = memberships.map((membership) => membership.workspace);

  const query = {
    $and: [
      {
        subject: {
          $in: workspaces,
        },
      },
      { ...filters },
    ],
  };

  const options = {
    populate: include,
    sort,
    limit: size,
    skip: (page - 1) * size,
  };

  const projection = {
    ...fields,
    permissions: false,
  };

  const events = await AppEvent.find(query, projection, options);
  const totalRecords = await AppEvent.countDocuments(query);

  return c.json.success({
    data: {
      events,
      totalRecords,
      totalPages: page && Math.ceil(totalRecords / size),
      page,
      size,
    },
  });
}

export async function getEvent(c) {}

export async function createEvent(c) {}

export async function updateEvent(c) {}

export function deleteEvent(c) {}
