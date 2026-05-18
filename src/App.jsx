import { useEffect, useState } from "react";
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
