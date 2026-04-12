import {
  Box, Typography, Link, Accordion, AccordionSummary, AccordionDetails,
  FormGroup, FormControlLabel, Checkbox,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { SamplePhoto } from "../../../types/api";

export interface GalleryFilters {
  lens: string;
  focal_length: string;
  shutter_speed: string;
  aperture: string;
  iso: string;
}

interface Props {
  photos: SamplePhoto[];
  filters: GalleryFilters;
  onChange: (filters: GalleryFilters) => void;
}

function unique(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean))).sort();
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string;
  onToggle: (val: string) => void;
}) {
  if (!options.length) return null;
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}
    >
      <AccordionSummary
        expandIcon={<ChevronRightIcon sx={{ color: "grey.400", fontSize: 18 }} />}
        sx={{
          flexDirection: "row-reverse",
          gap: 1,
          px: 0,
          py: 0.5,
          minHeight: "auto",
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": { transform: "rotate(90deg)" },
          "& .MuiAccordionSummary-content": { my: 0.5 },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, color: "grey.200" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, pt: 0, pb: 1 }}>
        <FormGroup>
          {options.map((opt) => (
            <FormControlLabel
              key={opt}
              control={
                <Checkbox
                  checked={selected === opt}
                  onChange={() => onToggle(selected === opt ? "" : opt)}
                  size="small"
                  sx={{ color: "grey.500", "&.Mui-checked": { color: "primary.light" }, py: 0.25 }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "grey.300", fontSize: "0.8rem" }}>
                  {opt}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}

export default function GalleryFilterSidebar({ photos, filters, onChange }: Props) {
  const lenses = unique(photos.map((p) => p.lens_name));
  const focalLengths = unique(photos.map((p) => p.focal_length));
  const shutterSpeeds = unique(photos.map((p) => p.shutter_speed));
  const apertures = unique(photos.map((p) => p.aperture));
  const isos = unique(photos.map((p) => p.iso));

  const hasFilters = Object.values(filters).some(Boolean);

  const set = (key: keyof GalleryFilters) => (val: string) =>
    onChange({ ...filters, [key]: val });

  return (
    <Box
      sx={{
        bgcolor: "#1a1a1a",
        borderRadius: 1,
        px: 2,
        py: 2,
        minWidth: 220,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1.5 }}>
        <Typography variant="body1" sx={{ fontWeight: 700, color: "white" }}>
          Filter by:
        </Typography>
        {hasFilters && (
          <Link
            component="button"
            variant="body2"
            sx={{ color: "grey.400", cursor: "pointer", textDecoration: "none", "&:hover": { color: "grey.200" } }}
            onClick={() => onChange({ lens: "", focal_length: "", shutter_speed: "", aperture: "", iso: "" })}
          >
            clear filters
          </Link>
        )}
      </Box>

      <FilterGroup title="Lenses" options={lenses} selected={filters.lens} onToggle={set("lens")} />
      <FilterGroup title="Focal lengths" options={focalLengths} selected={filters.focal_length} onToggle={set("focal_length")} />
      <FilterGroup title="Shutter speeds" options={shutterSpeeds} selected={filters.shutter_speed} onToggle={set("shutter_speed")} />
      <FilterGroup title="Apertures" options={apertures} selected={filters.aperture} onToggle={set("aperture")} />
      <FilterGroup title="ISOs" options={isos} selected={filters.iso} onToggle={set("iso")} />
    </Box>
  );
}
