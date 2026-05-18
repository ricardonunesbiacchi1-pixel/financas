
import { useState, useEffect } from "react";
import {
  Home,
  Wallet,
  Target,
  Settings,
  Calendar,
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

export default function App() {
  // LOCAL STORAGE
  // mantém os dados salvos mesmo fechando o site

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

  // SALVAR AUTOMATICAMENTE
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

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#081028] border-r border-white/10 p-6 hidden lg:flex flex-col">
        <div>
          <h1 className="text-3xl font-bold mb-10">
            Finan$e
          </h1>

          <nav className="space-y-3">
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
                label: "Rotas ML",
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
                icon: Calendar,
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
                onClick={() =>
                  setActivePage(item.id)
                }
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition ${
                  activePage === item.id
                    ? "bg-violet-600"
                    : "hover:bg-white/5"
                }`}
              >
                <item.icon />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-auto">
        {/* DASHBOARD */}
        {activePage === "dashboard" && (
          <>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-5xl font-bold">
                  Dashboard
                </h1>

                <p className="text-zinc-400 mt-2">
                  Controle financeiro completo
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(true)
                }
                className="bg-violet-600 px-6 py-4 rounded-2xl flex items-center gap-2"
              >
                <Plus />
                Nova Transação
              </button>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="flex justify-between">
                  <p className="text-zinc-400">
                    Saldo
                  </p>

                  <DollarSign />
                </div>

                <h2 className="text-4xl font-bold mt-4">
                  R$ {balance}
                </h2>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="flex justify-between">
                  <p className="text-zinc-400">
                    Receitas
                  </p>

                  <TrendingUp />
                </div>

                <h2 className="text-4xl font-bold text-emerald-400 mt-4">
                  R$ {income}
                </h2>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="flex justify-between">
                  <p className="text-zinc-400">
                    Despesas
                  </p>

                  <TrendingDown />
                </div>

                <h2 className="text-4xl font-bold text-red-400 mt-4">
                  R$ {expense}
                </h2>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="flex justify-between">
                  <p className="text-zinc-400">
                    Lucro Rotas
                  </p>

                  <Truck />
                </div>

                <h2 className="text-4xl font-bold text-violet-400 mt-4">
                  R$ {routesProfit}
                </h2>
              </div>
            </div>

            {/* GRÁFICOS */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 h-[350px]">
                <h2 className="text-2xl font-bold mb-6">
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
                      stroke="#8b5cf6"
                      strokeWidth={4}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 h-[350px]">
                <h2 className="text-2xl font-bold mb-6">
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
              <h1 className="text-4xl font-bold">
                Movimentações
              </h1>

              <button
                onClick={() =>
                  setShowModal(true)
                }
                className="bg-violet-600 px-6 py-4 rounded-2xl"
              >
                Nova
              </button>
            </div>

            <div className="space-y-4">
              {transactions.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 p-6 rounded-3xl flex justify-between items-center"
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

                  <div className="flex items-center gap-5">
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
                      onClick={() =>
                        removeTransaction(
                          item.id
                        )
                      }
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
            <h1 className="text-4xl font-bold mb-8">
              Rotas Mercado Livre
            </h1>

            <div className="bg-white/5 p-6 rounded-3xl mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Nome da rota"
                  value={routeName}
                  onChange={(e) =>
                    setRouteName(
                      e.target.value
                    )
                  }
                  className="bg-black/30 p-4 rounded-2xl"
                />

                <input
                  placeholder="Endereço"
                  value={routeAddress}
                  onChange={(e) =>
                    setRouteAddress(
                      e.target.value
                    )
                  }
                  className="bg-black/30 p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="KM"
                  value={routeKm}
                  onChange={(e) =>
                    setRouteKm(
                      e.target.value
                    )
                  }
                  className="bg-black/30 p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="Ganho"
                  value={routeGain}
                  onChange={(e) =>
                    setRouteGain(
                      e.target.value
                    )
                  }
                  className="bg-black/30 p-4 rounded-2xl"
                />

                <input
                  type="number"
                  placeholder="Despesa"
                  value={routeExpense}
                  onChange={(e) =>
                    setRouteExpense(
                      e.target.value
                    )
                  }
                  className="bg-black/30 p-4 rounded-2xl"
                />
              </div>

              <button
                onClick={addRoute}
                className="bg-violet-600 px-6 py-4 rounded-2xl mt-5"
              >
                Adicionar Rota
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <div className="bg-white/5 p-6 rounded-3xl">
                <p className="text-zinc-400">
                  Total KM
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  {totalKm} km
                </h2>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl">
                <p className="text-zinc-400">
                  Lucro Rotas
                </p>

                <h2 className="text-4xl font-bold text-violet-400 mt-3">
                  R$ {routesProfit}
                </h2>
              </div>
            </div>

            <div className="space-y-5">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white/5 p-6 rounded-3xl"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-3xl font-bold">
                        {route.name}
                      </h2>

                      <p className="text-zinc-400 mt-2">
                        📍 {route.address}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-black/30 p-4 rounded-2xl">
                      <p>KM</p>
                      <h3 className="text-2xl font-bold mt-2">
                        {route.km}
                      </h3>
                    </div>

                    <div className="bg-black/30 p-4 rounded-2xl">
                      <p>Ganho</p>
                      <h3 className="text-2xl font-bold text-emerald-400 mt-2">
                        R$ {route.gain}
                      </h3>
                    </div>

                    <div className="bg-black/30 p-4 rounded-2xl">
                      <p>Despesa</p>
                      <h3 className="text-2xl font-bold text-red-400 mt-2">
                        R$ {route.expense}
                      </h3>
                    </div>

                    <div className="bg-black/30 p-4 rounded-2xl">
                      <p>Lucro</p>
                      <h3 className="text-2xl font-bold text-violet-400 mt-2">
                        R$ {route.profit}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* METAS */}
        {activePage === "metas" && (
          <div className="bg-white/5 p-8 rounded-3xl">
            <h1 className="text-4xl font-bold mb-8">
              Metas
            </h1>

            <input
              type="number"
              value={goal}
              onChange={(e) =>
                setGoal(
                  Number(e.target.value)
                )
              }
              className="w-full bg-black/30 p-5 rounded-2xl text-3xl"
            />

            <div className="mt-8">
              <div className="flex justify-between mb-3">
                <span>Progresso</span>

                <span>
                  {Math.min(
                    Math.floor(
                      (balance / goal) * 100
                    ),
                    100
                  )}
                  %
                </span>
              </div>

              <div className="w-full h-5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-600"
                  style={{
                    width: `${Math.min(
                      (balance / goal) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* PLANEJAMENTO */}
        {activePage === "planejamento" && (
          <div>
            <h1 className="text-4xl font-bold mb-8">
              Planejamento
            </h1>

            <div className="flex gap-4 mb-8">
              <input
                placeholder="Novo planejamento"
                value={newPlan}
                onChange={(e) =>
                  setNewPlan(
                    e.target.value
                  )
                }
                className="flex-1 bg-white/5 p-5 rounded-2xl"
              />

              <button
                onClick={() => {
                  if (!newPlan) return;

                  setPlans([
                    ...plans,
                    newPlan,
                  ]);

                  setNewPlan("");
                }}
                className="bg-violet-600 px-6 rounded-2xl"
              >
                Adicionar
              </button>
            </div>

            <div className="space-y-4">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-5 rounded-2xl flex justify-between"
                >
                  <span>{plan}</span>

                  <button
                    onClick={() =>
                      setPlans(
                        plans.filter(
                          (_, i) =>
                            i !== index
                        )
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
            <h1 className="text-4xl font-bold mb-8">
              Relatórios
            </h1>

            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white/5 p-6 rounded-3xl">
                <p>Total Receitas</p>
                <h2 className="text-4xl font-bold text-emerald-400 mt-3">
                  R$ {income}
                </h2>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl">
                <p>Total Despesas</p>
                <h2 className="text-4xl font-bold text-red-400 mt-3">
                  R$ {expense}
                </h2>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl">
                <p>Lucro Final</p>
                <h2 className="text-4xl font-bold text-violet-400 mt-3">
                  R$ {balance}
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* CONFIGURAÇÕES */}
        {activePage === "configuracoes" && (
          <div>
            <h1 className="text-4xl font-bold mb-8">
              Configurações
            </h1>

            <div className="space-y-5">
              <div className="bg-white/5 p-6 rounded-3xl">
                <h2 className="text-2xl font-bold">
                  Sistema Financeiro
                </h2>

                <p className="text-zinc-400 mt-2">
                  Versão 2.0
                </p>
              </div>

              <button className="bg-red-500 px-6 py-4 rounded-2xl">
                Limpar Dados
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#081028] w-full max-w-md p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                Nova Transação
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Nome"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full bg-black/30 p-4 rounded-2xl"
              />

              <input
                type="number"
                placeholder="Valor"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="w-full bg-black/30 p-4 rounded-2xl"
              />

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
                className="w-full bg-black/30 p-4 rounded-2xl"
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
                className="w-full bg-violet-600 py-4 rounded-2xl"
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