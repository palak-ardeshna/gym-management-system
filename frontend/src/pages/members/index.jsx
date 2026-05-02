import React, { useState, useEffect } from 'react';
import { useGetMembersQuery, useDeleteMemberMutation, useAddMemberMutation, useUpdateMemberMutation } from '../../redux/apiSlice';
import MemberList from './MemberList';
import MemberModal from './MemberModal';
import ConfirmModal from '../../components/ConfirmModal';
import PlanModal from '../../components/PlanModal';

const Members = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [memberForPlan, setMemberForPlan] = useState(null);
  
  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isFetching } = useGetMembersQuery({ 
    page, 
    search: debouncedSearch,
    limit: 10 
  });
  
  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation();

  const members = data?.data?.items || [];
  const pagination = data?.data || {};

  const handleMemberSubmit = async (data) => {
    try {
      if (selectedMember?.id) {
        await updateMember({ id: selectedMember.id, ...data }).unwrap();
      } else {
        await addMember(data).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save member:', err);
    }
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (memberToDelete) {
      try {
        await deleteMember(memberToDelete.id).unwrap();
        setIsConfirmOpen(false);
        setMemberToDelete(null);
      } catch (err) {
        console.error('Failed to delete member:', err);
      }
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleAssignPlan = (member) => {
    setMemberForPlan(member);
    setIsPlanModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <MemberList
        members={members}
        pagination={pagination}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        isLoading={isLoading || isFetching}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onAssignPlan={handleAssignPlan}
        onAddNew={handleAddNew}
      />

      <MemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        member={selectedMember} 
        onSubmit={handleMemberSubmit}
        isLoading={isAdding || isUpdating}
      />

      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        memberId={memberForPlan?.id}
        memberName={memberForPlan?.fullName}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Member"
        message={`Are you sure you want to delete ${memberToDelete?.fullName}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
};

export default Members;
