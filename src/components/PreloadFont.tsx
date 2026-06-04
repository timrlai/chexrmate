import { useEffect } from "react";
import { type FontFamilies } from "@react-three/uikit";

const specialGothicCondensed =
  "/fonts/SpecialGothicCondensedOne_Regular_subset_msdf.json";

type PreloadFontProps = {
  setFontFamilies: (fontFamilies: FontFamilies) => void;
};

export default function PreloadFont({ setFontFamilies }: PreloadFontProps) {
  useEffect(() => {
    fetch(specialGothicCondensed).then(() => {
      const fontFamilies: FontFamilies = {
        gothic: {
          normal: specialGothicCondensed,
        },
      };

      if (fontFamilies) setFontFamilies(fontFamilies);
    });
  }, [setFontFamilies]);

  return null;
}
