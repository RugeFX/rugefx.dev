import {
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { LayoutGrid, List } from "lucide-react";
import PixelIcon from "@/components/os/pixel-icon";
import { fieldClass } from "@/components/os/retro";
import { projects, type Project } from "@/content/portfolio";
import { useAppFrame } from "@/contexts/app-frame-context";
import { useOS } from "@/contexts/os-context";
import { accentBackground, projectAccent } from "@/lib/accents";
import { cn } from "@/lib/utils";

type View = "icons" | "details";

export default function ProjectsApp() {
  const { isPhone } = useAppFrame();
  const { openProject } = useOS();
  const [view, setView] = useState<View>("icons");
  const [selected, setSelected] = useState<string | null>(null);
  const pointerType = useRef("mouse");
  const current = projects.find(({ slug }) => slug === selected);

  const itemProps = (project: Project) => ({
    "aria-selected": selected === project.slug,
    onPointerDown: (event: { pointerType: string }) => {
      pointerType.current = event.pointerType;
    },
    onClick: (event: MouseEvent<HTMLElement>) => {
      setSelected(project.slug);
      // Phones and touch screens open with one tap; mice double-click.
      if (isPhone || pointerType.current !== "mouse") {
        openProject(project.slug, { from: event.currentTarget });
      }
    },
    onDoubleClick: (event: MouseEvent<HTMLElement>) =>
      openProject(project.slug, { from: event.currentTarget }),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter") {
        openProject(project.slug, { from: event.currentTarget });
      }
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-2 px-1 pb-1">
        <span className="text-sm">Address</span>
        <span
          className={cn(
            fieldClass,
            "flex h-7 flex-1 items-center gap-2 px-2 font-mono text-sm",
          )}
        >
          <PixelIcon name="folder" className="size-4" />
          C:\Users\Zacky\Projects
        </span>
        <div role="group" aria-label="View" className="flex gap-0.5">
          <ViewButton
            label="Large icons"
            active={view === "icons"}
            onClick={() => setView("icons")}
          >
            <LayoutGrid />
          </ViewButton>
          <ViewButton
            label="Details"
            active={view === "details"}
            onClick={() => setView("details")}
          >
            <List />
          </ViewButton>
        </div>
      </div>

      <div
        className={cn(
          fieldClass,
          "retro-scroll @container min-h-0 flex-1 overflow-auto p-1",
        )}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
      >
        {view === "icons" ? (
          <ul
            role="listbox"
            aria-label="Projects"
            className="grid grid-cols-2 gap-x-3 gap-y-4 p-3 @md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]"
          >
            {projects.map((project) => (
              <li
                key={project.slug}
                role="option"
                tabIndex={0}
                className="group flex flex-col items-center gap-2 p-1 outline-none select-none"
                {...itemProps(project)}
              >
                <span
                  className={cn(
                    "bevel-in relative grid aspect-[4/3] w-full place-items-center overflow-hidden p-[2px]",
                    accentBackground[projectAccent[project.slug]],
                    selected === project.slug &&
                      "outline-brand outline-2 outline-offset-2",
                  )}
                >
                  {project.imageSrc && (
                    <img
                      src={project.imageSrc}
                      alt=""
                      loading="lazy"
                      draggable={false}
                      className={cn(
                        "size-full",
                        project.imageFit === "contain"
                          ? "object-contain p-3"
                          : "object-cover",
                      )}
                    />
                  )}
                  <PixelIcon
                    name={project.category === "Mobile" ? "phone" : "web"}
                    className="absolute bottom-1 left-1 size-6"
                  />
                </span>
                <span
                  className={cn(
                    "px-1 text-center text-sm group-focus-visible:outline-1 group-focus-visible:outline-dotted",
                    selected === project.slug && "bg-brand text-on-brand",
                  )}
                >
                  {project.title}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {["Name", "Type", "Summary"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="bevel bg-face sticky top-0 px-2 py-1 font-normal"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.slug}
                  tabIndex={0}
                  className={cn(
                    "outline-none select-none focus-visible:outline-1 focus-visible:outline-dotted",
                    selected === project.slug && "bg-brand text-on-brand",
                  )}
                  {...itemProps(project)}
                >
                  <td className="px-2 py-1.5">
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <PixelIcon
                        name={project.category === "Mobile" ? "phone" : "web"}
                        className="size-4"
                      />
                      {project.title}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 whitespace-nowrap">
                    {project.category === "Mobile" ? "Mobile app" : "Website"}
                  </td>
                  <td className="px-2 py-1.5">{project.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-0.5 flex shrink-0 gap-0.5 text-xs">
        <span className="bevel-thin w-28 shrink-0 px-2 py-1">
          {projects.length} object(s)
        </span>
        <span className="bevel-thin min-w-0 flex-1 truncate px-2 py-1">
          {current
            ? current.summary
            : isPhone
              ? "Tap a project to open it"
              : "Double-click a project to open it"}
        </span>
      </div>
    </div>
  );
}

interface ViewButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function ViewButton({ label, active, onClick, children }: ViewButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className={cn(
        "bg-face grid size-7 place-items-center [&_svg]:size-4",
        active ? "bevel-pressed bg-face-lt" : "bevel active:bevel-pressed",
      )}
    >
      {children}
    </button>
  );
}
