import BetForm from "../components/BetForm";

const Home = () => {
  return (
    <div className="bg-primary text-white min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-accent1">Welcome to PickPocket</h2>
      <p className="text-lg text-accent2 mt-2">Track your bets, prove your skills.</p>
      <div className="mt-8">
        <BetForm />
      </div>
    </div>
  );
};

export default Home;

  