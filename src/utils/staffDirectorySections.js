export const buildStaffDirectorySections = ({
  sites = [],
  people = [],
  includeEmptySites = false,
} = {}) => {
  const buckets = new Map();
  const hasGroupPeople = people.some((person) => !person.siteId);

  if (hasGroupPeople) {
    buckets.set("group", {
      id: "group",
      name: "Group Support",
      subtitle: "Executive office & multi-site team",
      icon: "shield",
      people: [],
    });
  }

  for (const site of sites) {
    buckets.set(site.id, {
      id: site.id,
      name: site.name,
      subtitle: site.areaName,
      icon: "building",
      people: [],
    });
  }

  for (const person of people) {
    const key = person.siteId || "group";
    if (!buckets.has(key)) {
      buckets.set(key, {
        id: key,
        name: person.siteName || person.location || "Other",
        subtitle: person.siteAreaName || "Group",
        icon: key === "group" ? "shield" : "building",
        people: [],
      });
    }
    buckets.get(key).people.push(person);
  }

  return [...buckets.values()].filter(
    (bucket) => bucket.people.length > 0 || (includeEmptySites && bucket.id !== "group"),
  );
};
