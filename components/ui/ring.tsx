export function Ring(props: { progress: number; color: string }) {
  const { progress, color } = props;

  // Calculate the circumference of the circle
  const radius = 100;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className="w-60 h-60">
      {/* <svg className="w-full h-full"> */}
      <svg className="w-full h-full">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="115"
          cx="120"
          cy="120"
        />
        <circle
          className={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="100"
          cx="120"
          cy="120"
        />
      </svg>
    </div>
  );
}
