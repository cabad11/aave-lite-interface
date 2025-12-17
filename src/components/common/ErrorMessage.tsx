const ErrorMessage = ({ message, refetch }: { message: string, refetch: () => void }) => {
  return (
    <div className={`
      rounded-3xl bg-red-50 p-6 text-center
      dark:bg-red-900/20
    `}
    >
      <p className={`
        font-medium text-red-600
        dark:text-red-400
      `}
      >
        {message}
      </p>
      <button
        onClick={() => refetch()}
        className="mt-3 cursor-pointer text-sm underline"
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorMessage;
