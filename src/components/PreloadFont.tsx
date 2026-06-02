import { useTTF, type FontFamilies } from "@react-three/uikit";
import { useEffect } from "react";

const specialGothicCondensed =
  "/fonts/SpecialGothicCondensedOne-Regular-subset.ttf";

type PreloadFontProps = {
  setFontFamilies: (fontFamilies: FontFamilies) => void;
};

export default function PreloadFont({ setFontFamilies }: PreloadFontProps) {
  const fontFamilies = useTTF(specialGothicCondensed);

  useEffect(() => {
    if (!fontFamilies) return;
    setFontFamilies(fontFamilies);
  }, [setFontFamilies, fontFamilies]);

  return null;
}
