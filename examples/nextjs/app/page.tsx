import { Widget } from './components/Widget';
import { WidgetEvents } from './components/WidgetEvents';

export default function Home() {
  return (
    <main>
      <WidgetEvents />
      <Widget />
    </main>
  );
}
