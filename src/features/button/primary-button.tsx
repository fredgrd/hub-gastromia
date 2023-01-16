import React from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import SpinnerJSON from "../../assets/spinner-animation-white.json";
import "./primary-button.css";

const PrimaryButton: React.FC<{
  onClick: () => void;
  options: {
    title: string;
    isEnabled: boolean;
    isLoading: boolean;
    isVisible: boolean;
  };
}> = ({ onClick, options }) => {
  if (!options.isVisible) {
    return null;
  }

  const variants: Variants = {
    enabled: {
      border: "2px solid #00ad0a",
      backgroundColor: "#00ad0a",
      color: "white",
    },
    disabled: {
      border: "2px solid #F6F7F8",
      backgroundColor: "#F6F7F8",
      color: "#C7C8CD",
    },
  };

  return (
    <motion.button
      variants={variants}
      initial={options.isEnabled ? "enabled" : "disabled"}
      animate={options.isEnabled ? "enabled" : "disabled"}
      whileTap={{ backgroundColor: "#207725" }}
      transition={{ duration: 0.2 }}
      className="gastromiakit-primarybutton-button"
      onClick={onClick}
      disabled={!options.isEnabled}
    >
      <AnimatePresence>
        {options.isLoading ? (
          <motion.div transition={{ duration: 0.2 }} exit={{ opacity: 0 }}>
            <Player
              autoplay={true}
              loop={true}
              src={SpinnerJSON}
              style={{ height: "40px", width: "40px" }}
            ></Player>
          </motion.div>
        ) : (
          <motion.div transition={{ duration: 0.2 }} exit={{ opacity: 0 }}>
            {options.title}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default PrimaryButton;
