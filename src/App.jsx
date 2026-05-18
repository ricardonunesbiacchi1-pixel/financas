import { useEffect, useState } from "react";
import {
  Home,
  Wallet,
  Target,
  Settings,
  CalendarDays,
  BarChart3,
  Plus,
  X,
  Trash2,
  Truck,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);

  // TRANSAÇÕES
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  // ROTAS
  const [routes, setRoutes] = useState(() => {
    const saved = localStorage.getItem("routes");
    return saved ? JSON.parse(saved) : [];
  });

  const [routeName, setRouteName] = useState("");
  const [routeAddress, setRouteAddress] = useState("");
  const [routeKm, setRouteKm] = useState("");
  const [routeGain, setRouteGain] = useState("");
  const [routeExpense, setRouteExpense] = useState("");

  // METAS
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem("goal");
    return saved ? JSON.parse(saved) : 5000;
  });

  // PLANEJAMENTO
  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem("plans");

    return saved
      ? JSON.parse(saved)
      : ["Guardar R$500"];
  });

  const [newPlan, setNewPlan] = useState("");

  // LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      "routes",
      JSON.stringify(routes)
    );
  }, [routes]);

  useEffect(() => {
    localStorage.setItem(
      "goal",
      JSON.stringify(goal)
    );
  }, [goal]);

  useEffect(() => {
    localStorage.setItem(
      "plans",
      JSON.stringify(plans)
    );
  }, [plans]);

  // ADICIONAR TRANSAÇÃO
  const addTransaction = () => {
    if (!title || !amount) return;

    const newTransaction = {
      id: Date.now(),
      title,
      amount: Number(amount),
      type,
    };

    setTransactions([
      newTransaction,
      ...transactions,
    ]);

    toast.success("Transação adicionada!");

    setTitle("");
    setAmount("");
    setType("income");
    setShowModal(false);
  };

  // REMOVER TRANSAÇÃO
  const removeTransaction = (id) => {
    setTransactions(
      transactions.filter(
        (item) => item.id !== id
      )
    );

    toast.success("Transação removida!");
  };

  // ADICIONAR ROTA
  const addRoute = () => {
    if (
      !routeName ||
      !routeAddress ||
      !routeKm ||
      !routeGain ||
      !routeExpense
    )
      return;

    const profit =
      Number(routeGain) -
      Number(routeExpense);

    const costKm =
      Number(routeExpense) /
      Number(routeKm);

    const newRoute = {
      id: Date.now(),
      name: routeName,
      address: routeAddress,
      km: Number(routeKm),
      gain: Number(routeGain),
      expense: Number(routeExpense),
      profit,
      costKm,
    };

    setRoutes([newRoute, ...routes]);

    toast.success("Rota adicionada!");

    setRouteName("");
    setRouteAddress("");
    setRouteKm("");
    setRouteGain("");
    setRouteExpense("");
  };

  // TOTAIS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  const routesProfit = routes.reduce(
    (acc, r) => acc + r.profit,
    0
  );

  const totalKm = routes.reduce(
    (acc, r) => acc + r.km,
    0
  );

  const chartData = routes.map((r) => ({
    name: r.name,
    lucro: r.profit,
  }));

  const pieData = [
    {
      name: "Receitas",
      value: income,
    },
    {
      name: "Despesas",
      value: expense,
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      <Toaster position="top-right" />

      {/* SIDEBAR */}
      <aside className="w-[260px] hidden lg:flex flex-col glass p-6 gap-4">
        <h1 className="text-4xl font-black mb-6">
          Finan$e
        </h1>

        {[
          {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
          },
          {
            id: "movimentacoes",
            label: "Movimentações",
            icon: Wallet,
          },
          {
            id: "rotas",
            label: "Rotas",
            icon: Truck,
          },
          {
            id: "metas",
            label: "Metas",
            icon: Target,
          },
          {
            id: "planejamento",
            label: "Planejamento",
            icon: CalendarDays,
          },
          {
            id: "relatorios",
            label: "Relatórios",
            icon: BarChart3,
          },
          {
            id: "configuracoes",
            label: "Configurações",
            icon: Settings,
          },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-3 p-4 rounded-2xl transition font-semibold ${
              activePage === item.id
                ? "bg-blue-600 neon-shadow"
                : "hover:bg-white/5"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-auto">

        {/* DASHBOARD */}
        {activePage === "dashboard" && (
          <>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 mb-10">
              <div>
                <h1 className="text-5xl font-black">
                  Dashboard
                </h1>

                <p className="text-zinc-400 mt-2">
                  Controle financeiro profissional
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="gradient-btn neon-shadow px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Plus />
                Nova Transação
              </button>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8 mobile-grid">

              <motion.div
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                className="glass p-6 rounded-3xl card-hover mobile-card"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-zinc-400">
                    Saldo Atual
                  </p>

                  <DollarSign />
                </div>

                <h2 className="text-4xl font-black">
                  R$ <CountUp end={balance} duration={1} />
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.1 }}
                className="glass p-6 rounded-3xl card-hover mobile-card"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-zinc-400">
                    Receitas
                  </p>

                  <TrendingUp />
                </div>

                <h2 className="text-4xl font-black text-emerald-400">
                  R$ <CountUp end={income} duration={1} />
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.2 }}
                className="glass p-6 rounded-3xl card-hover mobile-card"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-zinc-400">
                    Despesas
                  </p>

                  <TrendingDown />
                </div>

                <h2 className="text-4xl font-black text-red-400">
                  R$ <CountUp end={expense} duration={1} />
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.3 }}
                className="glass p-6 rounded-3xl card-hover mobile-card"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-zinc-400">
                    Lucro Rotas
                  </p>

                  <Truck />
                </div>

                <h2 className="text-4xl font-black text-violet-400">
                  R$ <CountUp end={routesProfit} duration={1} />
                </h2>
              </motion.div>

            </div>

            {/* GRÁFICOS */}
            <div className="grid md:grid-cols-2 gap-6">

              <div className="glass p-6 rounded-3xl h-[350px]">
                <h2 className="text-2xl font-bold mb-5">
                  Lucro das Rotas
                </h2>

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="lucro"
                      stroke="#3b82f6"
                      strokeWidth={4}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="glass p-6 rounded-3xl h-[350px]">
                <h2 className="text-2xl font-bold mb-5">
                  Receitas x Despesas
                </h2>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius={120}
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          </>
        )}

        {/* MOVIMENTAÇÕES */}
        {activePage === "movimentacoes" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-black">
                Movimentações
              </h1>

              <button
                onClick={() => setShowModal(true)}
                className="gradient-btn px-5 py-3 rounded-2xl font-bold"
              >
                Nova
              </button>
            </div>

            <div className="space-y-4">
              {transactions.map((item) => (
                <div
                  key={item.id}
                  className="glass p-6 rounded-3xl flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-2xl font-bold">
                      {item.title}
                    </h2>

                    <p className="text-zinc-400 mt-2">
                      {item.type === "income"
                        ? "Receita"
                        : "Despesa"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-2xl font-bold ${
                        item.type === "income"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      R$ {item.amount}
                    </span>

                    <button
                      onClick={() => removeTransaction(item.id)}
                      className="bg-red-500 p-3 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROTAS */}
        {activePage === "rotas" && (
          <div>
            <h1 className="text-4xl font-black mb-8">
              Rotas Mercado Livre
            </h1>

            <div className="glass p-6 rounded-3xl mb-8">
              <div className="grid md:grid-cols-2 gap-4">

                <input
                  placeholder="Nome da rota"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="p-4 rounded-2xl"
                />

                <input
                  placeholder="Endereço"
                  value={routeAddress}
                  onChange={(e) => setRouteAddress(e.target.value)}
                  className="p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="KM"
                  value={routeKm}
                  onChange={(e) => setRouteKm(e.target.value)}
                  className="p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="Ganho"
                  value={routeGain}
                  onChange={(e) => setRouteGain(e.target.value)}
                  className="p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="Despesa"
                  value={routeExpense}
                  onChange={(e) => setRouteExpense(e.target.value)}
                  className="p-4 rounded-2xl"
                />

              </div>

              <button
                onClick={addRoute}
                className="gradient-btn px-6 py-4 rounded-2xl mt-5 font-bold"
              >
                Adicionar Rota
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-8">

              <div className="glass p-6 rounded-3xl">
                <p className="text-zinc-400">
                  Total KM
                </p>

                <h2 className="text-4xl font-black mt-3">
                  {totalKm} km
                </h2>
              </div>

              <div className="glass p-6 rounded-3xl">
                <p className="text-zinc-400">
                  Lucro Rotas
                </p>

                <h2 className="text-4xl font-black text-violet-400 mt-3">
                  R$ {routesProfit}
                </h2>
              </div>

            </div>
          </div>
        )}

        {/* METAS */}
        {activePage === "metas" && (
          <div className="glass p-8 rounded-3xl">
            <h1 className="text-4xl font-black mb-8">
              Metas
            </h1>

            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="w-full p-5 rounded-2xl text-3xl"
            />

            <div className="mt-8">

              <div className="flex justify-between mb-3">
                <span>Progresso</span>

                <span>
                  {Math.floor((balance / goal) * 100)}%
                </span>
              </div>

              <div className="w-full h-5 bg-black/30 rounded-full overflow-hidden">

                <div
                  className="gradient-purple h-full"
                  style={{
                    width:`${Math.min((balance / goal) * 100,100)}%`
                  }}
                />

              </div>

            </div>
          </div>
        )}

        {/* PLANEJAMENTO */}
        {activePage === "planejamento" && (
          <div>
            <h1 className="text-4xl font-black mb-8">
              Planejamento
            </h1>

            <div className="flex gap-4 mb-8 flex-col md:flex-row">
              <input
                placeholder="Novo planejamento"
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value)}
                className="flex-1 p-5 rounded-2xl"
              />

              <button
                onClick={() => {
                  if (!newPlan) return;

                  setPlans([...plans, newPlan]);
                  setNewPlan("");
                }}
                className="gradient-btn px-6 rounded-2xl font-bold"
              >
                Adicionar
              </button>
            </div>

            <div className="space-y-4">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="glass p-5 rounded-2xl flex justify-between"
                >
                  <span>{plan}</span>

                  <button
                    onClick={() =>
                      setPlans(
                        plans.filter((_, i) => i !== index)
                      )
                    }
                    className="bg-red-500 p-2 rounded-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RELATÓRIOS */}
        {activePage === "relatorios" && (
          <div>
            <h1 className="text-4xl font-black mb-8">
              Relatórios
            </h1>

            <div className="grid md:grid-cols-3 gap-5">

              <div className="glass p-6 rounded-3xl">
                <p>Total Receitas</p>
                <h2 className="text-4xl font-black text-emerald-400 mt-3">
                  R$ {income}
                </h2>
              </div>

              <div className="glass p-6 rounded-3xl">
                <p>Total Despesas</p>
                <h2 className="text-4xl font-black text-red-400 mt-3">
                  R$ {expense}
                </h2>
              </div>

              <div className="glass p-6 rounded-3xl">
                <p>Lucro Final</p>
                <h2 className="text-4xl font-black text-violet-400 mt-3">
                  R$ {balance}
                </h2>
              </div>

            </div>
          </div>
        )}

        {/* CONFIGURAÇÕES */}
        {activePage === "configuracoes" && (
          <div>
            <h1 className="text-4xl font-black mb-8">
              Configurações
            </h1>

            <div className="glass p-6 rounded-3xl">
              <h2 className="text-2xl font-bold">
                Sistema Financeiro
              </h2>

              <p className="text-zinc-400 mt-3">
                Versão profissional mobile
              </p>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE NAV */}
      <div className="mobile-nav lg:hidden">

        <button onClick={() => setActivePage("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setActivePage("movimentacoes")}>
          Mov.
        </button>

        <button onClick={() => setActivePage("rotas")}>
          Rotas
        </button>

        <button onClick={() => setActivePage("metas")}>
          Metas
        </button>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass w-full max-w-md p-8 rounded-3xl">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black">
                Nova Transação
              </h2>

              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">

              <input
                placeholder="Nome"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-2xl"
              />

              <input
                type="number"
                placeholder="Valor"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 rounded-2xl"
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-4 rounded-2xl"
              >
                <option value="income">
                  Receita
                </option>

                <option value="expense">
                  Despesa
                </option>
              </select>

              <button
                onClick={addTransaction}
                className="gradient-btn w-full py-4 rounded-2xl font-bold"
              >
                Adicionar
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
npm run dev
```
