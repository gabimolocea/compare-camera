import {
  Box, Typography, Slider, FormGroup, FormControlLabel, Checkbox, Button, Accordion,
  AccordionSummary, AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface Filters {
  category: string;
  brand: string;
  price_min: number;
  price_max: number;
  release_year_min: number;
  release_year_max: number;
}

const CATEGORIES = ["mirrorless", "dslr", "compact", "cinema", "action"];
const CURRENT_YEAR = new Date().getFullYear();

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export default function FilterSidebar({ filters, onChange, onReset }: Props) {
  const update = (key: keyof Filters, value: string | number) =>
    onChange({ ...filters, [key]: value });

  return (
    <Box sx={{ width: 260, flexShrink: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <Button size="small" onClick={onReset}>Reset</Button>
      </Box>

      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Category</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {CATEGORIES.map((cat) => (
              <FormControlLabel
                key={cat}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.category === cat}
                    onChange={(e) => update("category", e.target.checked ? cat : "")}
                  />
                }
                label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Price range (USD)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={[filters.price_min, filters.price_max]}
            onChange={(_, val) => {
              const [min, max] = val as number[];
              onChange({ ...filters, price_min: min, price_max: max });
            }}
            min={0} max={10000} step={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `$${v}`}
          />
          <Typography variant="caption" color="text.secondary">
            ${filters.price_min} — ${filters.price_max}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Release year</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={[filters.release_year_min, filters.release_year_max]}
            onChange={(_, val) => {
              const [min, max] = val as number[];
              onChange({ ...filters, release_year_min: min, release_year_max: max });
            }}
            min={2010} max={CURRENT_YEAR} step={1}
            valueLabelDisplay="auto"
          />
          <Typography variant="caption" color="text.secondary">
            {filters.release_year_min} — {filters.release_year_max}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
