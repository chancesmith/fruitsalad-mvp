import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No client selected. Select a client on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new client.
      </Link>
    </p>
  );
}
