import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Box,
  Typography,
  Chip,
  Switch,
} from "@mui/material";
import { AdminPanelSettings, Person } from "@mui/icons-material";
import { Member } from "../../types";

interface MemberTableProps {
  members: Member[];
  onDelete: (id: string) => void;
  onToggleAdmin: (id: string, currentStatus: boolean) => void;
  currentUserId?: string; // Add current user ID to prevent self-revocation
}

const MemberTable: React.FC<MemberTableProps> = React.memo(
  ({ members, onDelete, onToggleAdmin, currentUserId }) => {
    if (members.length === 0) {
      return (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#64748b" }}>
            No members found
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Member
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Year of Birth
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Gender
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Role
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow
                key={member._id}
                sx={{
                  "&:hover": { backgroundColor: "#f8fafc" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: member.isAdmin ? "#fef3c7" : "#dbeafe",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: member.isAdmin ? "#f59e0b" : "#0284c7",
                      }}
                    >
                      {member.isAdmin ? <AdminPanelSettings /> : <Person />}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#0f172a" }}
                    >
                      {member.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.YOB}</TableCell>
                <TableCell>
                  <Chip
                    label={member.gender ? "Male" : "Female"}
                    size="small"
                    sx={{
                      backgroundColor: member.gender ? "#dbeafe" : "#fce7f3",
                      color: member.gender ? "#0284c7" : "#ec4899",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.isAdmin ? "Admin" : "User"}
                    size="small"
                    sx={{
                      backgroundColor: member.isAdmin ? "#fef3c7" : "#e0f2fe",
                      color: member.isAdmin ? "#f59e0b" : "#0ea5e9",
                      fontWeight: 600,
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
