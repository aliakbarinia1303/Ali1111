import { BRAND_NAME } from '../data/portfolioData';

interface HomeViewProps {
  about: string;
  hidden: boolean;
}

export function HomeView({ about, hidden }: HomeViewProps) {
  return (
    <section className="hero" id="homeView" hidden={hidden}>
      <h1 id="brand">{BRAND_NAME}</h1>
      <div className="bar" />
      <p className="about" id="about">
        {about}
      </p>
    </section>
  );
}
