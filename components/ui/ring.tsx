export function Ring(props: {
  progress: number;
  color: string;
  shimmer?: boolean;
  rainbow?: boolean;
}) {
  const { progress, color, shimmer = false, rainbow = false } = props;

  // Calculate the circumference of the circle
  const radius = 115;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className="w-60 h-60">
      <svg className="w-full h-full">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={radius + 5}
          cy={radius + 5}
        />
        <circle
          className={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={
            ((100 - Math.min(100, progress)) / 100) * circumference
          }
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={radius + 5}
          cy={radius + 5}
        />
      </svg>
    </div>
  );
}
