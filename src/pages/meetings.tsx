import { useState, useEffect } from 'react';
import { title as titleStyle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useAuth } from '@/contexts/AuthContext';
import { MeetingNote } from '@/types/meeting';
import { createMeetingNote, getMeetingNotes, updateMeetingNote, deleteMeetingNote } from '@/services/meetingService';
import { button as buttonStyles } from "@heroui/theme";
import { Modal } from '@/components/Modal';
import { TrashIcon } from '../components/icons/index';

const MeetingsPage = () => {
  const { userData } = useAuth();
  const [meetings, setMeetings] = useState<MeetingNote[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [attendees, setAttendees] = useState<string[]>([]);
  const [attendeesInput, setAttendeesInput] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeeting, setEditedMeeting] = useState<Partial<MeetingNote> | null>(null);
  const [editedAttendeesInput, setEditedAttendeesInput] = useState('');

  useEffect(() => {
    if (userData?.id) {
      loadMeetings(userData.id);
    }
  }, [userData]);

  const loadMeetings = async (userId: string) => {
    try {
      const notes = await getMeetingNotes(userId);
      setMeetings(notes);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    if (!userData?.organisations[0] || !userData?.id) return;

    const newMeeting: Omit<MeetingNote, 'id' | 'createdAt' | 'updatedAt'> = {
      organisationId: userData.organisations[0],
      title: meetingTitle,
      date: new Date(),
      attendees,
      notes,
      actionItems: actionItems.split('\n').map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text: text.trim(),
        assignee: '',
        completed: false,
        createdAt: new Date()
      })),
      createdBy: userData.id
    };

    try {
      await createMeetingNote(newMeeting);
      loadMeetings(userData.id);
      clearForm();
      setIsNewMeetingModalOpen(false);
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const clearForm = () => {
    setMeetingTitle('');
    setNotes('');
    setAttendees([]);
    setAttendeesInput('');
    setActionItems('');
  };

  const handleStartEditing = () => {
    if (selectedMeeting) {
      setEditedMeeting({
        title: selectedMeeting.title,
        notes: selectedMeeting.notes,
        attendees: [...selectedMeeting.attendees],
        actionItems: selectedMeeting.actionItems
      });
      setEditedAttendeesInput(selectedMeeting.attendees.join(', '));
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedMeeting || !editedMeeting || !userData?.id) return;

    try {
      await updateMeetingNote(selectedMeeting.id, editedMeeting, userData.id);
      loadMeetings(userData.id);
      setIsEditing(false);
      setSelectedMeeting(null);
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, meetingId: string) => {
    e.stopPropagation(); // Prevent opening the meeting details
    if (!userData?.id) return;

    if (window.confirm('Are you sure you want to delete this meeting note?')) {
      try {
        await deleteMeetingNote(meetingId, userData.id);
        loadMeetings(userData.id);
      } catch (error) {
        console.error('Error deleting meeting:', error);
      }
    }
  };

  if (!userData?.id || !userData?.organisations[0]) {
    return (
      <DefaultLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            Please complete your profile setup to access meeting notes.
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className={titleStyle()}>Meeting Notes</h2>
          <button
            onClick={() => setIsNewMeetingModalOpen(true)}
            className={buttonStyles({
              color: "primary",
              radius: "md",
              variant: "shadow"
            })}
          >
            New Meeting
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : meetings.length === 0 ? (
            <div className="text-center text-gray-500">No meetings found</div>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 cursor-pointer relative group"
                onClick={() => setSelectedMeeting(meeting)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{meeting.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {meeting.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      {meeting.actionItems.length} action items
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, meeting.id)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete meeting"
                    >
                      <TrashIcon className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>
                {meeting.aiSummary && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">Summary:</p>
                    <p>{meeting.aiSummary}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* New Meeting Modal */}
        <Modal
          isOpen={isNewMeetingModalOpen}
          onClose={() => setIsNewMeetingModalOpen(false)}
          title="New Meeting"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Attendees (comma-separated)</label>
              <input
                type="text"
                value={attendeesInput}
                onChange={(e) => setAttendeesInput(e.target.value)}
                onBlur={() => setAttendees(attendeesInput.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="John Doe, Jane Smith"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Action Items (one per line)</label>
              <textarea
                value={actionItems}
                onChange={(e) => setActionItems(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsNewMeetingModalOpen(false)}
                className={buttonStyles({
                  color: "default",
                  radius: "md",
                  variant: "light"
                })}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMeeting}
                className={buttonStyles({
                  color: "primary",
                  radius: "md",
                  variant: "shadow"
                })}
              >
                Save Meeting Notes
              </button>
            </div>
          </div>
        </Modal>

        {/* Meeting Details Modal */}
        <Modal
          isOpen={!!selectedMeeting}
          onClose={() => {
            setSelectedMeeting(null);
            setIsEditing(false);
            setEditedMeeting(null);
          }}
          title={selectedMeeting?.title || ''}
        >
          {selectedMeeting && (
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={editedMeeting?.title || ''}
                      onChange={(e) => setEditedMeeting(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Attendees (comma-separated)</label>
                    <input
                      type="text"
                      value={editedAttendeesInput}
                      onChange={(e) => setEditedAttendeesInput(e.target.value)}
                      onBlur={() => setEditedMeeting(prev => ({
                        ...prev,
                        attendees: editedAttendeesInput.split(',').map(s => s.trim()).filter(Boolean)
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={editedMeeting?.notes || ''}
                      onChange={(e) => setEditedMeeting(prev => ({ ...prev, notes: e.target.value }))}
                      rows={6}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Action Items (one per line)</label>
                    <textarea
                      value={editedMeeting?.actionItems?.map(item => item.text).join('\n') || ''}
                      onChange={(e) => setEditedMeeting(prev => ({
                        ...prev,
                        actionItems: e.target.value.split('\n').map((text, index) => ({
                          id: `${Date.now()}-${index}`,
                          text: text.trim(),
                          assignee: '',
                          completed: false,
                          createdAt: new Date()
                        })).filter(item => item.text)
                      }))}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedMeeting(null);
                      }}
                      className={buttonStyles({
                        color: "default",
                        radius: "md",
                        variant: "light"
                      })}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className={buttonStyles({
                        color: "primary",
                        radius: "md",
                        variant: "shadow"
                      })}
                    >
                      Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Attendees</h3>
                    <p>{selectedMeeting.attendees.join(', ') || 'No attendees listed'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="whitespace-pre-wrap">{selectedMeeting.notes}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Action Items</h3>
                    <ul className="list-disc pl-5">
                      {selectedMeeting.actionItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.text}
                          {item.assignee && ` - Assigned to: ${item.assignee}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {selectedMeeting.aiSummary && (
                    <div>
                      <h3 className="font-semibold mb-2">AI Summary</h3>
                      <p>{selectedMeeting.aiSummary}</p>
                    </div>
                  )}
                  {selectedMeeting.aiInsights && (
                    <div>
                      <h3 className="font-semibold mb-2">AI Insights</h3>
                      <p>{selectedMeeting.aiInsights}</p>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={handleStartEditing}
                      className={buttonStyles({
                        color: "primary",
                        radius: "md",
                        variant: "light"
                      })}
                    >
                      Edit Meeting
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default MeetingsPage; 