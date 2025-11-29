import { Main as MainComponent } from "./components/index-page/main";
import { Header } from "./components/header";

export default function Home() {
  return (
    <>
      <Header/>
      <MainComponent/>
    </>
  );
}
