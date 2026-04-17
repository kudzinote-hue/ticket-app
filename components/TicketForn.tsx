'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { TicketCategory } from '@/types';

export function TicketForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user: '',
    category: '' as TicketCategory | '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        // If category is empty string, omit it so triage can auto-assign
        category: formData.category || undefined,
      };
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Failed to submit ticket: ${error.error}`);
      }
    } catch (error) {
      alert('Error submitting ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit New Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={5}
              required
            />
          </div>
          <div>
            <Label htmlFor="user">Your Name/ID</Label>
            <Input
              id="user"
              value={formData.user}
              onChange={e => setFormData({...formData, user: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category (optional)</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({...formData, category: value as TicketCategory})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Auto-detect" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Access">Access</SelectItem>
                <SelectItem value="Payroll">Payroll</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Leave blank for automatic classification.
            </p>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}