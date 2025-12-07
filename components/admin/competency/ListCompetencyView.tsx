'use client';
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Competency, Criteria } from '@/types/interfaces/model';
import { AlertCircle, ChevronLeft, Edit2, Layers, Plus, Scale, Search, Trash2, X } from 'lucide-react';

export interface ListViewProps {
  setEditingComp: () => void,
  setCompModalOpen: () => void,
  setSearchTerm: () => void
}


export const ListView = ({ setEditingComp, setCompModalOpen, setSearchTerm }: ListViewProps) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Competency Frameworks</h1>
        <p className="text-slate-500">Manage evaluation standards and criteria.</p>
      </div>
      <Button onClick={() => { setEditingComp(null); setCompModalOpen(true); }}>
        <Plus className="mr-2 h-4 w-4" /> Create Framework
      </Button>
    </div>

    <div className="flex items-center space-x-2 bg-white p-1 rounded-md border max-w-sm">
      <Search className="ml-2 h-4 w-4 text-slate-400" />
      <Input
        placeholder="Search frameworks..."
        className="border-0 focus-visible:ring-0 px-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <Card>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm text-left">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[80px]">ID</th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Framework Name</th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden md:table-cell">Created</th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden md:table-cell">Last Updated</th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredCompetencies.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No frameworks found. Create one to get started.
                </td>
              </tr>
            ) : (
              filteredCompetencies.map((comp) => (
                <tr key={comp.ma_khung_nang_luc} className="border-b transition-colors hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-500">#{comp.ma_khung_nang_luc}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{comp.ten_nang_luc}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[300px]">{comp.mo_ta}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">{formatDate(comp.ngay_tao)}</td>
                  <td className="p-4 hidden md:table-cell">{formatDate(comp.ngay_cap_nhat)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedCompId(comp.ma_khung_nang_luc); setView('detail'); }}>
                        View
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditingComp(comp); setCompModalOpen(true); }}>
                        <Edit2 className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCompetency(comp.ma_khung_nang_luc)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);