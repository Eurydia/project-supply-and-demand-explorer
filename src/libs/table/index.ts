import { registerAllModules } from "handsontable/registry";
import { getTheme, mainTheme, registerTheme } from "handsontable/themes";
import { theme } from "@/theme";

export const TABLE_THEME_NAME = "supply-demand-earth";

let initialized = false;

export function initializeTable() {
  if (initialized) {
    return;
  }

  registerAllModules();

  if (getTheme(TABLE_THEME_NAME) === undefined) {
    registerTheme(TABLE_THEME_NAME, mainTheme)
      .setColorScheme("light")
      .setDensityType("compact")
      .params({
        tokens: {
          fontFamily: String(theme.typography.fontFamily),
          fontSize: theme.spacing(1.625),
          borderRadius: theme.spacing(0),
          borderColor: theme.palette.divider,
          accentColor: theme.palette.secondary.main,
          foregroundColor: theme.palette.text.primary,
          foregroundSecondaryColor: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.paper,
          backgroundSecondaryColor: theme.alpha(
            theme.palette.primary.main,
            0.12,
          ),
          cellHorizontalBorderColor: theme.palette.divider,
          cellVerticalBorderColor: theme.palette.divider,
          rowCellOddBackgroundColor: theme.palette.background.paper,
          rowCellEvenBackgroundColor: theme.alpha(
            theme.palette.primary.main,
            0.12,
          ),
          rowHeaderOddBackgroundColor: theme.palette.background.paper,
          rowHeaderEvenBackgroundColor: theme.alpha(
            theme.palette.primary.main,
            0.12,
          ),
          headerFontWeight: "700",
          headerForegroundColor: theme.palette.primary.contrastText,
          headerBackgroundColor: theme.palette.primary.dark,
          headerHighlightedForegroundColor: theme.palette.primary.contrastText,
          headerHighlightedBackgroundColor: theme.palette.primary.main,
          headerActiveForegroundColor: theme.palette.primary.contrastText,
          headerActiveBackgroundColor: theme.palette.primary.dark,
          cellEditorBorderColor: theme.palette.secondary.main,
          cellEditorBackgroundColor: theme.alpha(
            theme.palette.warning.main,
            0.28,
          ),
          cellSelectionBorderColor: theme.palette.secondary.main,
          cellSelectionBackgroundColor: theme.alpha(
            theme.palette.warning.main,
            0.28,
          ),
          cellErrorBackgroundColor: theme.alpha(
            theme.palette.secondary.main,
            0.2,
          ),
          scrollbarTrackColor: theme.palette.background.default,
          scrollbarThumbColor: theme.palette.text.secondary,
        },
      });
  }

  initialized = true;
}
