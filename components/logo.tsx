import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label={`${APP_NAME} kezdőlap`}>
      <span className="logo-mark" aria-hidden="true">
        <span />
      </span>
      {APP_NAME}
    </Link>
  );
}
