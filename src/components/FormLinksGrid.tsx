"use client";

import FormLinkButton from "./FormLinkButton";
import type { FormLink } from "@/data/formLinks";
import { motion } from "framer-motion";

type FormLinksGridProps = {
  links: FormLink[];
};

export default function FormLinksGrid({ links }: FormLinksGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch content-stretch"
    >
      {links.map((itemLink) => (
        <motion.div key={itemLink.href} variants={item} className="h-full">
          <FormLinkButton href={itemLink.href} label={itemLink.label} />
        </motion.div>
      ))}
    </motion.section>
  );
}
