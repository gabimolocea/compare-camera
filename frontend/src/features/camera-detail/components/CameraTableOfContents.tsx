import { Box, Paper, Typography } from "@mui/material";
import { useCallback } from "react";

export interface TocSection {
  anchor: string;
  label: string;
}

interface Props {
  sections: TocSection[];
}

export default function CameraTableOfContents({ sections }: Props) {
  const scrollTo = useCallback((anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box
        component="ol"
        sx={{
          m: 0,
          py: 1.5,
          px: 0,
          listStyle: "none",
          counterReset: "toc-counter",
        }}
      >
        {sections.map((s, i) => (
          <Box
            component="li"
            key={s.anchor}
            onClick={() => scrollTo(s.anchor)}
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: 1.5,
              px: 2.5,
              py: 0.6,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{ minWidth: 22, color: "text.primary", flexShrink: 0, textAlign: "right" }}
            >
              {i + 1}.
            </Typography>
            <Typography
              component="span"
              variant="body2"
              sx={{ color: "primary.main" }}
            >
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
