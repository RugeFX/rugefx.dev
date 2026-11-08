import { useState } from "react";
import PixelIcon, { type PixelIconName } from "@/components/os/pixel-icon";
import { buttonClass, fieldClass } from "@/components/os/retro";
import { useOS } from "@/contexts/os-context";
import { usePlayground } from "@/contexts/playground-context";
import { cn } from "@/lib/utils";

interface Item {
  name: string;
  icon: PixelIconName;
  size: string;
  note: string;
}

const items: Item[] = [
  {
    name: "portfolio-v1",
    icon: "folder",
    size: "2 MB",
    note: "The first version of this site. It had a parallax hero. We don't talk about it.",
  },
  {
    name: "bugs.txt",
    icon: "readme",
    size: "0 KB",
    note: "Empty. Every bug in here got fixed. Probably.",
  },
  {
    name: "jquery.min.js",
    icon: "web",
    size: "87 KB",
    note: "Served with honour from 2006 to 2015. Rest easy.",
  },
  {
    name: "node_modules",
    icon: "folder",
    size: "1.2 TB",
    note: "Deleting this frees up most of the hard drive. It will be back after the next install.",
  },
];

export default function TrashApp() {
  const { showDialog } = useOS();
  const { play, toast } = usePlayground();
  const [contents, setContents] = useState(items);

  const empty = () =>
    showDialog({
      title: "Confirm Delete",
      icon: "warning",
      message: `Are you sure you want to delete these ${contents.length} items for good?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setContents([]);
            play("trash");
            toast("Recycle Bin emptied. 1.2 TB freed.");
          },
        },
        { label: "No" },
      ],
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 gap-1 px-1 pb-1.5">
        <button
          type="button"
          className={buttonClass}
          disabled={!contents.length}
          onClick={empty}
        >
          Empty Recycle Bin
        </button>
      </div>
      <div
        className={cn(
          fieldClass,
          "retro-scroll min-h-0 flex-1 overflow-auto p-1",
        )}
      >
        {contents.length ? (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2 p-2">
            {contents.map((item) => (
              <li key={item.name}>
                <button
                  type="button"
                  className="hover:bg-brand/15 flex w-full flex-col items-center gap-1 p-2 text-center text-sm"
                  onClick={() =>
                    showDialog({
                      title: item.name,
                      icon: "info",
                      message: `${item.note} (${item.size})`,
                    })
                  }
                >
                  <PixelIcon name={item.icon} className="size-10" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-ink-muted grid h-full place-items-center p-6 text-center text-sm">
            <div>
              <PixelIcon name="trash" className="mx-auto mb-2 size-12" />
              The Recycle Bin is empty. Squeaky clean.
            </div>
          </div>
        )}
      </div>
      <div className="mt-0.5 flex shrink-0 text-xs">
        <span className="bevel-thin flex-1 px-2 py-1">
          {contents.length} object(s)
        </span>
      </div>
    </div>
  );
}
