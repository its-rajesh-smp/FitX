import { motion } from "motion/react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between"
    >
      <h1 className="text-2xl font-bold"> Template UI </h1>
      <Button variant="outline">Button</Button>
    </motion.div>
  );
};
