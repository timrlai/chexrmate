import { useXRSessionModeSupported, type XRStore } from "@react-three/xr";

type XRButtonProps = {
  store: XRStore | null;
  existingSession: XRSession | null;
  setSession: (session: XRSession | null) => void;
};

export default function XRButton({
  store,
  existingSession,
  setSession,
}: XRButtonProps) {
  const arSupported = useXRSessionModeSupported("immersive-ar");

  const onEnterXr = () => {
    if (!arSupported || !store) return;
    store.enterAR().then((session: XRSession | undefined) => {
      console.log("session:", session);
      if (!existingSession && session) setSession(session);
    });
  };

  return (
    <nav id="xr-button-container">
      <button
        onClick={onEnterXr}
        disabled={!arSupported}
        className="special-gothic-condensed-one-regular"
      >
        {arSupported ? "Enter AR" : "AR Unavailable"}
      </button>
    </nav>
  );
}
