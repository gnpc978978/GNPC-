import {
  FaNewspaper,
  FaUsers,
  FaMicrophone,
  FaGraduationCap,
  FaAward,
  FaImages,
} from "react-icons/fa";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";

export default function Objectives() {
  const objectives = [
    {
      icon: FaNewspaper,
      title: "Ethical Journalism",
      description:
        "Promoting responsible, transparent and truthful journalism with integrity.",
    },
    {
      icon: FaUsers,
      title: "Professional Networking",
      description:
        "Building a strong network among journalists and media professionals.",
    },
    {
      icon: FaMicrophone,
      title: "Press Conferences",
      description:
        "Organizing press conferences, media interactions and public discussions.",
    },
    {
      icon: FaGraduationCap,
      title: "Media Development",
      description:
        "Supporting skill development and knowledge sharing for journalists.",
    },
    {
      icon: FaAward,
      title: "Recognition & Excellence",
      description:
        "Recognizing contributions and achievements in the field of journalism.",
    },
    {
      icon: FaImages,
      title: "Media Documentation",
      description:
        "Preserving important events, activities and press club memories.",
    },
  ];

  return (
    <section className="bg-slate-50 py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          badge="Our Objectives"
          title="Empowering Journalism & Media Community"
          description="Greater Noida Press Club works towards promoting ethical journalism, professional growth and stronger media collaboration."
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:gap-8 lg:grid-cols-3">
          {objectives.map((objective) => {
            const Icon = objective.icon;

            return (
              <Card key={objective.title} padding="sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 sm:h-16 sm:w-16 sm:rounded-2xl">
                  <Icon className="text-lg text-blue-600 sm:text-3xl" />
                </div>

                <h3 className="mt-3 text-sm font-bold leading-tight text-slate-900 sm:mt-6 sm:text-2xl">
                  {objective.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
                  {objective.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
