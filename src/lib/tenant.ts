import { useSubscription } from "./useSubscription";

/**
 * Retorna o `orgId` do usuário autenticado no sistema.
 * É baseado nos dados de `useSubscription` (que consolida o Custom Claim ou Firestore doc).
 */
export function useOrganization() {
  const { orgId, loading, role, isMaster } = useSubscription();

  return { orgId, loading, role, isMaster };
}
