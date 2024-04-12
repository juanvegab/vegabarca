import { Button } from "@/components/ui/button";
import logo from "/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Linkedin, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Home = () => {
  const { userId } = auth();
  if (userId) redirect("/notes");

  const sectionsStyles =
    // "mb-4 w-full rounded-lg border px-6 py-4 shadow-lg md:w-1/2 lg:w-1/3 xl:w-1/4";
    "mb-4 w-full rounded-lg border px-6 py-4 shadow-lg";

  return (
    <main className="p-4">
      <div className="grid grid-flow-row-dense auto-rows-auto grid-cols-4 gap-4">
        <section className={cn(sectionsStyles, "w-1/")}>
          <h1 className="flex flex-col text-3xl">
            <span className="font-bold">Juanca Vega</span>
            <small className="mb-2">Juan Carlos Vega Abarca</small>
            <span className="text-2xl">Software Engineer</span>
            <span className="text-2xl">Front-end Developer</span>
          </h1>

          <hr className="my-4" />

          <h2 className="text-xl font-bold">Contact and Networks</h2>
          <div>
            <ul>
              <li>
                Email:{" "}
                <Button asChild variant="link">
                  <Link href="mailto:juancarlos@vegabarca.com">
                    juancarlos@vegabarca.com
                  </Link>
                </Button>
              </li>
              <li>
                Phone:{" "}
                <Button asChild variant="link">
                  <Link href="tel:(+506) 7012-3940">(+506) 7012-3940</Link>
                </Button>
              </li>
              <li>Address: San José, Costa Rica</li>
              <li>
                <Button asChild variant="link">
                  <Link
                    className="px-0 py-0"
                    href="https://www.linkedin.com/in/juanvegab"
                  >
                    <Linkedin
                      className="mr-1 rounded-full bg-blue-600 p-1 text-white"
                      size={30}
                    />{" "}
                    LinkedIn
                  </Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="link">
                  <Link
                    className="px-0 py-0"
                    href="https://github.com/juanvegab"
                  >
                    <Github
                      className="mr-1 rounded-full bg-black p-1 text-white"
                      size={30}
                    />{" "}
                    Github
                  </Link>
                </Button>
              </li>
            </ul>
          </div>

          <hr className="my-4" />

          <h2 className="text-xl font-bold">Languages</h2>
          <div>
            <ul>
              <li>
                <span className="font-semibold">Spanish:</span> Native
              </li>
              <li>
                <span className="font-semibold">English:</span> Professional
                Working
              </li>
              <li>
                <span className="font-semibold">Italian:</span> Advanced
              </li>
            </ul>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <h2 className="text-xl font-bold">Bio</h2>
          <p className="mb-2">
            Coming from lively Costa Rica, I&apos;m a software developer fueled
            by kindness, simplicity, and love for innovation. Since 2009,
            I&apos;ve grown from a backend developer to mastering the art of
            creating engaging experiences for desktops, smartphones, and
            tablets.
          </p>
          <p className="mb-2">
            With JavaScript as my main tool, I&apos;ve explored different
            libraries to make user interfaces intuitive. From JQuery&apos;s
            basic approach in the early days to React&apos;s versatility
            nowadays, I&apos;ve constantly learned new skills. Collaborating
            closely with design teams, I&apos;ve improved user experiences and
            aesthetics.
          </p>
          <p className="mb-2">
            Exploring other technologies like Vue, SvelteKit, and Elixir has
            opened new doors for me, making applications more efficient.
            Venturing into AI has been exciting, making user interactions
            smarter and more engaging. In this ever-changing tech world,
            I&apos;m always eager to learn and contribute to the next big thing
            in software development.
          </p>
          <p className="mb-2">
            PD: I love plants, italian food, ride my motorcycle with my
            fidanzata, coffee, cook and obviously wine.
          </p>
        </section>

        <section className={cn(sectionsStyles, "")}>
          <h2 className="text-xl font-bold">Skills & Tools</h2>
          <div className="flex flex-wrap gap-3">
            <div className="mb-2">
              <h3 className="font-semibold">AI</h3>
              <div className="flex flex-wrap gap-1">
                <Badge>AI Models</Badge>
                <Badge>Vectors</Badge>
                <Badge>ML</Badge>
              </div>
            </div>

            <div className="mb-2">
              <h3 className="font-semibold">Frontend</h3>
              <div className="flex flex-wrap gap-1">
                <Badge>React.js</Badge>
                <Badge>Next.js</Badge>
                <Badge>AngularJS</Badge>
                <Badge>Angular</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Vue</Badge>
                <Badge>SvelteKit</Badge>
                <Badge>Redux</Badge>
                <Badge>HTML</Badge>
                <Badge>CSS & CSS3</Badge>
                <Badge>SASS</Badge>
                <Badge>Bootstrap</Badge>
                <Badge>JavaScript</Badge>
                <Badge>Responsive design </Badge>
                <Badge>Flexbox</Badge>
                <Badge>Mobile-first design</Badge>
                <Badge>Tailwind</Badge>
                <Badge>GSAP</Badge>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="font-semibold">Mobile App Development</h3>
              <div className="flex flex-wrap gap-1">
                <Badge>React Native</Badge>
                <Badge>Ionic</Badge>
                <Badge>Cordova</Badge>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="font-semibold">Backend</h3>
              <div className="flex flex-wrap gap-1">
                <Badge>Node.js</Badge>
                <Badge>NestJS</Badge>
                <Badge>Express</Badge>
                <Badge>Elixir</Badge>
                <Badge>Phoenix Live</Badge>
                <Badge>Python</Badge>
                <Badge>PHP</Badge>
                <Badge>Wordpress</Badge>
                <Badge>Jekyll</Badge>
                <Badge>C#</Badge>
              </div>
            </div>
            <div className="mb-2">
              <h3 className="font-semibold">Databases</h3>
              <div className="flex flex-wrap gap-1">
                <Badge>PostgreSQL</Badge>
                <Badge>MongoDB</Badge>
                <Badge>Firebase</Badge>
                <Badge>Airtable</Badge>
                <Badge>MySQL</Badge>
                <Badge>SQL Server</Badge>
                <Badge>GraphQL</Badge>
              </div>
            </div>

            <div className="mb-2">
              <h3 className="font-semibold">Others</h3>
              <div className="flex flex-wrap gap-1">
                <Badge>GIT</Badge>
                <Badge>GitFlow</Badge>
                <Badge>Figma</Badge>
                <Badge>UI/UX Design</Badge>
                <Badge>Atlassian Jira-4</Badge>
                <Badge>Atlassian Confluence</Badge>
                <Badge>Beanstalk</Badge>
                <Badge>AWS Cognito</Badge>
                <Badge>Linux </Badge>
                <Badge>Vercel</Badge>
              </div>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <h2 className="text-xl font-bold">Education</h2>
          <div>
            <h3 className="font-semibold">Universidad Cenfotec</h3>
            <p>Software Engineering Diploma</p>
            <p>2008 - 2011</p>
          </div>
          <div>
            <h3 className="font-semibold">Universidad Cenfotec</h3>
            <p>Web Development Diploma</p>
            <p>2010 - 2012</p>
          </div>
          <div>
            <h3 className="font-semibold">Origami Academy</h3>
            <p>Wordpress Theming - Certification</p>
            <p>2013</p>
          </div>
          <div>
            <h3 className="font-semibold">Ultimate Courses By Todd Motto</h3>
            <p>Software Engineering Diploma</p>
            <p>December 2019</p>
          </div>
          <div>
            <h3 className="font-semibold">Ultimate Courses By Todd Motto</h3>
            <p>Angular Framework Certification</p>
            <p>February 2020</p>
          </div>
          <div>
            <h3 className="font-semibold">Ultimate Courses By Todd Motto</h3>
            <p>NGRX State Management Certification</p>
            <p>May 2020</p>
          </div>
        </section>
      </div>
      <div className="mx-auto mt-4 w-full max-w-[900px]">
        <h2 className="mb-4 text-xl font-bold">Experience</h2>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
                <Badge>Next.js</Badge>
                <Badge>Sass</Badge>
                <Badge>SEO</Badge>
                <Badge>Core Web Vitals</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6">
                <li>
                  Implemented complex UI features using React and Next.js,
                  ensuring optimal performance and user experience.
                </li>
                <li>
                  Utilized Sass for efficient styling and maintaining consistent
                  design patterns across the application.
                </li>
                <li>
                  Implemented SEO audits and on-page optimization strategies to
                  boost website visibility, ranking, and Core Web Vitals metrics
                  for enhanced performance.
                </li>
                <li>
                  Conducted code reviews and provided mentorship to junior
                  developers, promoting best practices and maintaining code
                  quality standards.
                </li>
                <li>
                  Collaborated with design and product teams to translate
                  wireframes and mockups into interactive and responsive web
                  interfaces.
                </li>
                <li>
                  Implemented lazy loading and code splitting techniques to
                  optimize bundle size and improve website loading performance.
                </li>
                <li>
                  Implemented responsive design principles using CSS media
                  queries and Flexbox/Grid layouts to ensure a consistent user
                  experience across devices.
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
                <Badge>Next.js</Badge>
                <Badge>Sass</Badge>
                <Badge>SEO</Badge>
                <Badge>Core Web Vitals</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6">
                <li>
                  Implemented complex UI features using React and Next.js,
                  ensuring optimal performance and user experience.
                </li>
                <li>
                  Utilized Sass for efficient styling and maintaining consistent
                  design patterns across the application.
                </li>
                <li>
                  Implemented SEO audits and on-page optimization strategies to
                  boost website visibility, ranking, and Core Web Vitals metrics
                  for enhanced performance.
                </li>
                <li>
                  Conducted code reviews and provided mentorship to junior
                  developers, promoting best practices and maintaining code
                  quality standards.
                </li>
                <li>
                  Collaborated with design and product teams to translate
                  wireframes and mockups into interactive and responsive web
                  interfaces.
                </li>
                <li>
                  Implemented lazy loading and code splitting techniques to
                  optimize bundle size and improve website loading performance.
                </li>
                <li>
                  Implemented responsive design principles using CSS media
                  queries and Flexbox/Grid layouts to ensure a consistent user
                  experience across devices.
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Memory Lane — Frontend Architect
              </h3>
              <p className="mb-2">June 2023 - February 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>AI</Badge>
                <Badge>React</Badge>
                <Badge>Tailwind</Badge>
                <Badge>Sass</Badge>
                <Badge>UI/UX Design</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6">
                <li>
                  Orchestrated product conceptualization and defined
                  requirements, guiding the development process effectively.
                </li>
                <li>
                  Architected frontend CI/CD structures to ensure efficient and
                  automated deployment pipelines.
                </li>
                <li>
                  Provided strategic leadership to the frontend team, aligning
                  efforts with project objectives and architectural vision.
                </li>
                <li>
                  Leveraged tools like React and Tailwind to develop robust
                  pages, components, services, and hooks.
                </li>
                <li>
                  Leveraged artificial intelligence to transcribe user-narrated
                  stories into text and generate related questions based on the
                  content.
                </li>
                <li>
                  Conducted rigorous Pull Request reviews to maintain code
                  quality and adherence to architectural standards.
                </li>
                <li>
                  Planned product delivery planning to achieve seamless
                  integration of features and meet project timelines
                  effectively.
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Ressemble / Brus.ai — Full Stack Developer
              </h3>
              <p className="mb-2">February 2023 - June 2023</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>Ai</Badge>
                <Badge>Next.js</Badge>
                <Badge>Elixir</Badge>
                <Badge>Phoenix Live</Badge>
                <Badge>UI/UX Design</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
        <section className={cn(sectionsStyles, "")}>
          <div>
            <div>
              <h3 className="text-2xl font-semibold">
                Edx — Senior Web Developer
              </h3>
              <p className="mb-2">July 2023 - March 2024</p>
              <div className="mb-6 flex flex-wrap gap-1">
                <Badge>React</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ul className="list-disc pl-6"></ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
