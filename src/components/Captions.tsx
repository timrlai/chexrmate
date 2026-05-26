import { useXR } from "@react-three/xr";
import { Hud, PerspectiveCamera } from "@react-three/drei";
import { useTTF, Container, Text } from "@react-three/uikit";

import specialGothicCondensed from "../assets/fonts/SpecialGothicCondensedOne-Regular.ttf";

export default function Captions() {
  const { session } = useXR();
  const fontFamilies = useTTF(specialGothicCondensed);
  return (
    session && (
      <Hud>
        <PerspectiveCamera makeDefault position={[0, 0, 10]}>
          <group position={[0.5, 0.5, -2]}>
            <Container
              fontFamilies={fontFamilies}
              backgroundColor="black"
              borderRadius={5}
              paddingX={10}
              paddingY={5}
            >
              <Text color="white" fontSize={12}>
                Hello
              </Text>
            </Container>
          </group>
        </PerspectiveCamera>
      </Hud>
    )
  );
}
