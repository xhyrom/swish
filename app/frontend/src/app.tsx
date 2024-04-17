import {
  GetQueue as getQueueFromBackend,
  RemoveTrack as removeTrackFromDatabase,
} from "../wailsjs/go/database/Database";
import { database } from "../wailsjs/go/models";
import { EventsOn } from "../wailsjs/runtime/runtime";
import { Component, ComponentChild, h } from "preact";
import { useEffect } from "preact/hooks";
import { ItemCard } from "./components/ItemCard";
import { trackToItem, Item } from "./transformations";
import toast, { Toaster } from "react-hot-toast";

const newTrackNotify = (id: number) =>
  toast.success(`New track with number ${id} arrived`);

export class App extends Component<{}, { items: Item[] }> {
  constructor() {
    super();
    this.state = {
      items: [],
    };
  }

  componentDidMount(): void {
    EventsOn("table_changes", (data) => {
      const track = JSON.parse(data).data as database.Track;

      this.addTrack(track);
      newTrackNotify(track.id);
    });
  }

  async getQueue(): Promise<void> {
    const queue = (await getQueueFromBackend()) || [];

    const items = await Promise.all(queue.map(trackToItem));

    this.setState({
      items,
    });
  }

  async addTrack(track: database.Track): Promise<void> {
    const item = await trackToItem(track);

    this.setState((state, _) => {
      return {
        items: [...state.items, item],
      };
    });
  }

  deleteTrack(id: number): void {
    const result = removeTrackFromDatabase(id);

    toast.promise(result, {
      loading: `Deleting track number ${id}...`,
      success: () => {
        this.setState((state, _) => {
          return {
            items: state.items.filter((item) => item.id !== id),
          };
        });

        return `Track number ${id} deleted`;
      },
      error: "Error deleting track",
    });
  }

  render(): ComponentChild {
    useEffect(() => {
      this.getQueue();
    }, []);

    return (
      <>
        <div id="App">
          <Toaster />
          <section className="px-2 md:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {this.state.items.length === 0 && <p>Loading...</p>}
            {this.state.items.map((item) => (
              <ItemCard
                item={item}
                deleteTrack={() => this.deleteTrack(item.id)}
              />
            ))}
          </section>
        </div>
      </>
    );
  }
}
