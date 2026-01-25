import React, { useState } from "react";
import Carousel from "mui-carousel-react";
import { Paper, Button, Typography } from "@mui/material";

import "../style/SecondExample.scss";
import Settings, { DefaultSettingsT, SettingsT } from "./Settings";

const SecondExample = () => {
  const [settings, setSettings] = useState<SettingsT>(DefaultSettingsT);

  return (
    <div style={{ marginTop: "50px", color: "#494949" }}>
      <Typography variant="h4">Example: Featured Projects</Typography>
      <br />
      <Carousel className="SecondExample" {...settings}>
        {items.map((item, index) => {
          return <Project item={item} key={index} />;
        })}
      </Carousel>
      <br />
      <Settings settings={settings} setSettings={setSettings} />
    </div>
  );
};

type Item = {
  name: string;
  description: string;
  color: string;
  href: string;
};

interface ProjectProps {
  item: Item;
}

function Project({ item }: ProjectProps) {
  return (
    <Paper
      className="Project"
      style={{
        backgroundColor: item.color,
      }}
      elevation={10}
    >
      <Typography variant="h5">{item.name}</Typography>
      <br />
      <Typography>{item.description}</Typography>

      <Button
        className="CheckButton"
        component="a"
        href={item.href}
        target="_blank"
        rel="noreferrer"
      >
        Check it out!
      </Button>
    </Paper>
  );
}

const items: Item[] = [
  {
    name: "MUI Carousel React",
    description: "A Generic, extendible carousel UI component for React using Material UI v7.",
    color: "#64ACC8",
    href: "https://github.com/coderchef26/mui-carousel",
  },
  {
    name: "Azmara Technologies",
    description: "Professional web development and technology solutions based in New Zealand.",
    color: "#7D85B1",
    href: "https://azmara.io",
  },
  {
    name: "React Components",
    description: "High-quality, accessible, and performant React components for modern web apps.",
    color: "#CE7E78",
    href: "https://github.com/coderchef26",
  },
  {
    name: "Support This Project",
    description: "Help us maintain and improve this library with your support!",
    color: "#C9A27E",
    href: "https://buymeacoffee.com/alghaazi",
  },
];

export default SecondExample;
