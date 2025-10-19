import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { AdminPanelSettings, Person } from "@mui/icons-material";
import { Member } from "../../types";

interface MemberTableProps {
  members: Member[];
  onDelete: (id: string) => void;
  onToggleAdmin: (id: string, currentStatus: boolean) => void;
  currentUserId?: string;
}

const tableContainerSx = {
  borderRadius: 3,
  background: "rgba(9, 12, 20, 0.82)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
  backdropFilter: "blur(24px)",
  overflowX: "auto" as const,
} as const;

const emptyStateSx = {
  textAlign: "center" as const,
  py: 8,
  borderRadius: 3,
  background: "rgba(12, 16, 26, 0.78)",
  border: "1px dashed rgba(255,255,255,0.12)",
  color: "var(--text-secondary)",
  backdropFilter: "blur(18px)",
} as const;

const avatarShellSx = (isAdmin: boolean) => ({
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: isAdmin
    ? "linear-gradient(135deg, rgba(250,204,21,0.22) 0%, rgba(251,191,36,0.18) 100%)"
    : "linear-gradient(135deg, rgba(96,165,250,0.18) 0%, rgba(14,165,233,0.14) 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: isAdmin ? "#facc15" : "#38bdf8",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 18px 36px rgba(0,0,0,0.45)",
}) as const;

const MemberTable: React.FC<MemberTableProps> = React.memo(
  ({ members }) => {
    if (members.length === 0) {
      return (
        <Box sx={emptyStateSx}>
          <Typography variant="h6" sx={{ color: "var(--text-secondary)" }}>
            No members found
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1.5, color: "rgba(255,255,255,0.55)" }}
          >
            Invite your first member to build the community.
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={tableContainerSx}>
        <Table
          sx={{
            minWidth: 960,
            "& th": {
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.75rem",
              color: "rgba(226,232,240,0.9)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            },
            "& td": {
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                background:
                  "linear-gradient(90deg, rgba(193,156,255,0.18) 0%, rgba(56,189,248,0.16) 65%, rgba(24,36,54,0.6) 100%)",
              }}
            >
              <TableCell>Member</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Year of Birth</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow
                key={member._id}
                sx={{
                  "&:hover": {
                    background: "rgba(255,255,255,0.04)",
                  },
                  transition: "background 0.2s ease",
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Box sx={avatarShellSx(member.isAdmin)}>
                      {member.isAdmin ? (
                        <AdminPanelSettings fontSize="small" />
                      ) : (
                        <Person fontSize="small" />
                      )}
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        ID: {(member._id ?? "").slice(-6).toUpperCase() || "UNKNOWN"}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: "var(--text-secondary)" }}>
                    {member.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: "var(--text-secondary)" }}>
                    {member.YOB}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.gender ? "Male" : "Female"}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      textTransform: "capitalize",
                      backgroundColor: member.gender
                        ? "rgba(59,130,246,0.18)"
                        : "rgba(236,72,153,0.16)",
                      color: member.gender ? "#60a5fa" : "#f472b6",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.isAdmin ? "Admin" : "User"}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      backgroundColor: member.isAdmin
                        ? "rgba(250,204,21,0.18)"
                        : "rgba(13,148,136,0.18)",
                      color: member.isAdmin ? "#facc15" : "#34d399",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);

MemberTable.displayName = "MemberTable";

export default MemberTable;
