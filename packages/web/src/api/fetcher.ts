export const fetcher = (path: string) =>
  fetch(`${path}`, {
    method: "GET",
  }).then((res) => res.json());
