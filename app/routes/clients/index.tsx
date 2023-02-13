import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No client selected. Select a client on the left, or{" "}
      <Link to="new-inline" className="text-blue-500 underline">
        create a new client (inline)
      </Link>{" "}
      or{" "}
      <Link to="new-top" className="text-blue-500 underline">
        create a new client (top)
      </Link>
    </p>
  );
}
