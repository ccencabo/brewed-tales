import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock3, Mail, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import WrappedBookSVG from "../components/WrappedBookSVG";
import {
  acceptExchange,
  cancelExchange,
  completeExchange,
  declineExchange,
  fetchExchanges,
  type Exchange,
} from "../lib/exchanges";

const statusLabels: Record<Exchange["status"], string> = {
  pending: "Awaiting owner response",
  accepted: "Accepted — arrange your exchange",
  completed: "Exchange completed",
  cancelled: "Exchange cancelled",
};

const Exchanges = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchExchanges(controller.signal)
      .then(setExchanges)
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Could not load exchanges");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const runAction = async (
    id: number,
    action: (exchangeId: number) => Promise<Exchange>,
    successMessage: string,
  ) => {
    setBusyId(id);
    try {
      const updated = await action(id);
      setExchanges((current) =>
        current.map((exchange) => (exchange.id === id ? updated : exchange)),
      );
      toast.success(successMessage);
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Could not update the exchange");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="paper-texture min-h-screen px-4 pb-24 pt-32 sm:pb-10">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="font-handwritten text-sm uppercase tracking-[0.2em] text-primary">reader-to-reader</p>
        <h1 className="font-handwritten text-5xl text-foreground md:text-6xl">My Exchanges</h1>
        <div className="journal-divider mx-auto my-3 w-56" />
        <p className="font-body italic text-muted-foreground">Review requests, share contact details safely, and close the loop together.</p>
      </div>

      {loading ? (
        <p className="mt-20 animate-pulse text-center font-handwritten text-2xl text-muted-foreground">Checking the exchange journal...</p>
      ) : error ? (
        <p className="mt-20 text-center font-body text-destructive">{error}</p>
      ) : exchanges.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="font-handwritten text-2xl text-muted-foreground">No exchanges yet.</p>
          <Link to="/community" className="font-handwritten text-xl text-primary underline underline-offset-4">visit the community shelf →</Link>
        </div>
      ) : (
        <main className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {exchanges.map((exchange, index) => {
            const myCompletion = exchange.role === "owner" ? exchange.completion.owner : exchange.completion.requester;
            const otherCompletion = exchange.role === "owner" ? exchange.completion.requester : exchange.completion.owner;
            return (
              <motion.article
                key={exchange.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="dog-ear relative rounded-sm border border-border bg-card p-6 shadow-journal"
              >
                {exchange.actionRequired && <div className="absolute -right-2 -top-2 rounded-full bg-primary px-3 py-1 font-handwritten text-sm text-primary-foreground">action needed</div>}
                <div className="flex gap-4">
                  <WrappedBookSVG color={exchange.listing.coverColor} emoji={exchange.listing.emoji} className="h-32 w-24 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-handwritten text-sm uppercase tracking-wider text-primary">{exchange.role === "owner" ? "Your listed book" : "Your shelf request"}</p>
                    <h2 className="font-handwritten text-2xl text-foreground">with {exchange.counterparty.displayName}</h2>
                    <p className="mt-1 flex items-center gap-1 font-body text-xs italic text-muted-foreground"><Clock3 className="h-3.5 w-3.5" /> {statusLabels[exchange.status]}</p>
                    {exchange.counterparty.email && <p className="mt-3 flex items-center gap-2 break-all font-handwritten text-base text-primary"><Mail className="h-4 w-4 shrink-0" /> {exchange.counterparty.email}</p>}
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-border" />
                <div className="space-y-1">
                  {exchange.listing.hooks.map((hook) => <p key={hook} className="font-body text-xs italic text-muted-foreground">✦ {hook}</p>)}
                </div>

                {exchange.status === "accepted" && (
                  <div className="mt-4 rounded-sm bg-secondary/60 p-3 font-body text-xs text-muted-foreground">
                    <p>Your confirmation: {myCompletion ? "complete ✓" : "not yet complete"}</p>
                    <p>{exchange.counterparty.displayName}: {otherCompletion ? "complete ✓" : "not yet complete"}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {exchange.role === "owner" && exchange.status === "pending" && (
                    <>
                      <button disabled={busyId === exchange.id} onClick={() => void runAction(exchange.id, acceptExchange, "Exchange accepted — contact details are now available")} className="flex items-center gap-1 rounded-sm bg-primary px-4 py-2 font-handwritten text-lg text-primary-foreground disabled:opacity-50"><Check className="h-4 w-4" /> Accept</button>
                      <button disabled={busyId === exchange.id} onClick={() => void runAction(exchange.id, declineExchange, "Request declined and book returned to the shelf")} className="flex items-center gap-1 rounded-sm border border-destructive/30 px-4 py-2 font-handwritten text-lg text-destructive disabled:opacity-50"><X className="h-4 w-4" /> Decline</button>
                    </>
                  )}
                  {exchange.role === "requester" && exchange.status === "pending" && (
                    <button disabled={busyId === exchange.id} onClick={() => void runAction(exchange.id, cancelExchange, "Request cancelled")} className="rounded-sm border border-border px-4 py-2 font-handwritten text-lg text-muted-foreground disabled:opacity-50">Cancel request</button>
                  )}
                  {exchange.status === "accepted" && !myCompletion && (
                    <button disabled={busyId === exchange.id} onClick={() => void runAction(exchange.id, completeExchange, "Your completion is recorded")} className="rounded-sm bg-primary px-4 py-2 font-handwritten text-lg text-primary-foreground disabled:opacity-50">Mark my side complete</button>
                  )}
                  {exchange.status === "accepted" && (
                    <button disabled={busyId === exchange.id} onClick={() => void runAction(exchange.id, cancelExchange, "Exchange cancelled")} className="rounded-sm border border-border px-4 py-2 font-handwritten text-lg text-muted-foreground disabled:opacity-50">Cancel exchange</button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </main>
      )}
    </div>
  );
};

export default Exchanges;
