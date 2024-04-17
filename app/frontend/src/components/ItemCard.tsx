import { h } from "preact";
import type { Item } from "../transformations";
import toast from "react-hot-toast";

interface CardProps {
  item: Item;
  deleteTrack: () => void;
}

const copyUrlNotify = (track: number) =>
  toast.success(`Link for track ${track} copied to clipboard`);

export function ItemCard(props: CardProps) {
  function copyUrl() {
    navigator.clipboard.writeText(props.item.url);
    copyUrlNotify(props.item.id);
  }

  return (
    <div class="p-4 bg-gray-50 rounded-lg">
      <h1 class="font-bold text-lg">{props.item.title}</h1>
      <p class="text-gray-500 text-1xl">Id: {props.item.id}</p>
      <div>{props.item.from && <p>From: {props.item.from}</p>}</div>
      <div>{props.item.to && <p>To: {props.item.to}</p>}</div>

      <div class="mt-4 flex flex-wrap justify-start sm:space-x-4">
        <a
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          href={props.item.url}
          target="_blank"
        >
          Open
        </a>

        <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={copyUrl}
        >
          Copy
        </button>

        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={props.deleteTrack}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
