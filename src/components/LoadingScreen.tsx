type LoadingScreenProps = {
  progress: number;
};

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <div id="loading">
      <div id="loading-content">
        <progress max={100} value={progress}>
          {progress.toFixed(0)}%
        </progress>
        <h2>
          <span className="fa-solid fa-chess fa-spin"></span> Loading...{" "}
          {progress.toFixed(0)}%
        </h2>
      </div>
    </div>
  );
}
