import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Logo"
        >
          <path
            d="M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        Nikode
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
