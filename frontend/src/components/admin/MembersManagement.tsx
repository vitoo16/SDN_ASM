import React, { useCallback, useMemo } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { Member } from "../../types";
import { membersAPI } from "../../services/api";
import MemberTable from "./MemberTable";

const MembersManagement: React.FC = () => {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await membersAPI.getAllMembers();
      setMembers(response.data.data.members);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this member?")) {
        return;
      }

      try {
        await membersAPI.deleteMember(id);
        await fetchMembers();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to delete member");
      }
    },
    [fetchMembers]
  );

  const handleToggleAdmin = useCallback(
    async (id: string, currentStatus: boolean) => {
      if (
        !window.confirm(
          `Are you sure you want to ${
            currentStatus ? "revoke" : "grant"
          } admin privileges?`
        )
      ) {
        return;
      }

      try {
        await membersAPI.updateMemberAdmin(id, { isAdmin: !currentStatus });
        await fetchMembers();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to update admin status");
      }
    },
    [fetchMembers]
  );

  const memoizedTable = useMemo(
    () => (
      <MemberTable
        members={members}
        onDelete={handleDelete}
        onToggleAdmin={handleToggleAdmin}
      />
    ),
    [members, handleDelete, handleToggleAdmin]
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#0ea5e9" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}
          >
            Members Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            {members.length} members total
          </Typography>
        </Box>
      </Box>

      {memoizedTable}
    </Box>
  );
};

export default MembersManagement;
