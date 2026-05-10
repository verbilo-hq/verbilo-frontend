import { fetchJson } from "./http";

export async function fetchMe() {
  return fetchJson("/users/me");
}
