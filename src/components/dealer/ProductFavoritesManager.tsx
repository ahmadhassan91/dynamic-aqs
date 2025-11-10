'use client';

import { useState, useMemo } from 'react';
import {
  Stack,
  Title,
  Tabs,
  Grid,
  Card,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
  TextInput,
  Textarea,
  Select,
  Modal,
  NumberFormatter,
  Image,
  Divider,
  Alert,
  Menu,
  Tooltip,
  Pagination,
  Checkbox,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconHeart,
  IconHeartFilled,
  IconList,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconShare,
  IconNotes,
  IconShoppingCart,
  IconEye,
  IconDots,
  IconFolder,
  IconFolderPlus,
  IconX,
  IconAlertCircle,
} from '@tabler/icons-react';
import { MockProduct } from '@/lib/mockData/generators';
import { FavoriteProduct, ProductList } from '@/app/dealer/catalog/favorites/page';

interface ProductFavoritesManagerProps {
  products: MockProduct[];
  favoriteProducts: FavoriteProduct[];
  productLists: ProductList[];
  onUpdateFavorites: (favorites: FavoriteProduct[]) => void;
  onUpdateProductLists: (lists: ProductList[]) => void;
}

export function ProductFavoritesManager({
  products,
  favoriteProducts,
  productLists,
  onUpdateFavorites,
  onUpdateProductLists,
}: ProductFavoritesManagerProps) {
  const [activeTab, setActiveTab] = useState<string | null>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Modals
  const [createListOpened, { open: openCreateList, close: closeCreateList }] = useDisclosure(false);
  const [editListOpened, { open: openEditList, close: closeEditList }] = useDisclosure(false);
  const [addNotesOpened, { open: openAddNotes, close: closeAddNotes }] = useDisclosure(false);
  const [shareListOpened, { open: openShareList, close: closeShareList }] = useDisclosure(false);
  
  // Form states
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [newListCategory, setNewListCategory] = useState('');
  const [editingList, setEditingList] = useState<ProductList | null>(null);
  const [editingFavorite, setEditingFavorite] = useState<FavoriteProduct | null>(null);
  const [favoriteNotes, setFavoriteNotes] = useState('');
  const [sharingList, setSharingList] = useState<ProductList | null>(null);
  const [shareWithEmail, setShareWithEmail] = useState('');
  const [sharePermission, setSharePermission] = useState<'view' | 'edit'>('view');
  const [sharedUsers, setSharedUsers] = useState<Array<{email: string, permission: 'view' | 'edit'}>>([]);

  const itemsPerPage = 12;

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return cats.map(cat => ({ value: cat, label: cat }));
  }, [products]);

  // Get unique list categories
  const listCategories = useMemo(() => {
    const cats = Array.from(new Set(productLists.map(list => list.category).filter(Boolean)));
    return cats.map(cat => ({ value: cat!, label: cat! }));
  }, [productLists]);

  // Filter favorites based on search and category
  const filteredFavorites = useMemo(() => {
    return favoriteProducts.filter(favorite => {
      const product = favorite.product;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [favoriteProducts, searchQuery, selectedCategory]);

  // Paginate favorites
  const paginatedFavorites = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFavorites.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFavorites, currentPage]);

  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);

  const handleToggleFavorite = (product: MockProduct) => {
    const existingFavorite = favoriteProducts.find(fav => fav.product.id === product.id);
    
    if (existingFavorite) {
      // Remove from favorites
      const updatedFavorites = favoriteProducts.filter(fav => fav.product.id !== product.id);
      onUpdateFavorites(updatedFavorites);
    } else {
      // Add to favorites
      const newFavorite: FavoriteProduct = {
        id: `fav-${Date.now()}`,
        product,
        addedDate: new Date(),
        customListIds: [],
      };
      onUpdateFavorites([...favoriteProducts, newFavorite]);
    }
  };

  const handleCreateList = () => {
    if (!newListName.trim()) return;

    const newList: ProductList = {
      id: `list-${Date.now()}`,
      name: newListName.trim(),
      description: newListDescription.trim() || undefined,
      category: newListCategory.trim() || undefined,
      productIds: selectedProducts,
      createdDate: new Date(),
      updatedDate: new Date(),
      isShared: false,
      sharedWith: [],
    };

    onUpdateProductLists([...productLists, newList]);
    
    // Add selected products to the new list
    if (selectedProducts.length > 0) {
      const updatedFavorites = favoriteProducts.map(fav => {
        if (selectedProducts.includes(fav.product.id)) {
          return {
            ...fav,
            customListIds: [...fav.customListIds, newList.id],
          };
        }
        return fav;
      });
      onUpdateFavorites(updatedFavorites);
    }

    // Reset form
    setNewListName('');
    setNewListDescription('');
    setNewListCategory('');
    setSelectedProducts([]);
    closeCreateList();
  };

  const handleEditList = (list: ProductList) => {
    setEditingList(list);
    setNewListName(list.name);
    setNewListDescription(list.description || '');
    setNewListCategory(list.category || '');
    openEditList();
  };

  const handleUpdateList = () => {
    if (!editingList || !newListName.trim()) return;

    const updatedList: ProductList = {
      ...editingList,
      name: newListName.trim(),
      description: newListDescription.trim() || undefined,
      category: newListCategory.trim() || undefined,
      updatedDate: new Date(),
    };

    const updatedLists = productLists.map(list => 
      list.id === editingList.id ? updatedList : list
    );
    onUpdateProductLists(updatedLists);

    // Reset form
    setEditingList(null);
    setNewListName('');
    setNewListDescription('');
    setNewListCategory('');
    closeEditList();
  };

  const handleDeleteList = (listId: string) => {
    // Remove list
    const updatedLists = productLists.filter(list => list.id !== listId);
    onUpdateProductLists(updatedLists);

    // Remove list reference from favorites
    const updatedFavorites = favoriteProducts.map(fav => ({
      ...fav,
      customListIds: fav.customListIds.filter(id => id !== listId),
    }));
    onUpdateFavorites(updatedFavorites);
  };

  const handleAddToList = (listId: string, productId: string) => {
    // Add product to list
    const updatedLists = productLists.map(list => {
      if (list.id === listId && !list.productIds.includes(productId)) {
        return {
          ...list,
          productIds: [...list.productIds, productId],
          updatedDate: new Date(),
        };
      }
      return list;
    });
    onUpdateProductLists(updatedLists);

    // Update favorite's list references
    const updatedFavorites = favoriteProducts.map(fav => {
      if (fav.product.id === productId && !fav.customListIds.includes(listId)) {
        return {
          ...fav,
          customListIds: [...fav.customListIds, listId],
        };
      }
      return fav;
    });
    onUpdateFavorites(updatedFavorites);
  };

  const handleRemoveFromList = (listId: string, productId: string) => {
    // Remove product from list
    const updatedLists = productLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          productIds: list.productIds.filter(id => id !== productId),
          updatedDate: new Date(),
        };
      }
      return list;
    });
    onUpdateProductLists(updatedLists);

    // Update favorite's list references
    const updatedFavorites = favoriteProducts.map(fav => {
      if (fav.product.id === productId) {
        return {
          ...fav,
          customListIds: fav.customListIds.filter(id => id !== listId),
        };
      }
      return fav;
    });
    onUpdateFavorites(updatedFavorites);
  };

  const handleAddNotes = (favorite: FavoriteProduct) => {
    setEditingFavorite(favorite);
    setFavoriteNotes(favorite.notes || '');
    openAddNotes();
  };

  const handleSaveNotes = () => {
    if (!editingFavorite) return;

    const updatedFavorites = favoriteProducts.map(fav => {
      if (fav.id === editingFavorite.id) {
        return {
          ...fav,
          notes: favoriteNotes.trim() || undefined,
        };
      }
      return fav;
    });
    onUpdateFavorites(updatedFavorites);

    setEditingFavorite(null);
    setFavoriteNotes('');
    closeAddNotes();
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAllProducts = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(paginatedFavorites.map(fav => fav.product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleShareList = (list: ProductList) => {
    setSharingList(list);
    setSharedUsers(list.sharedWith.map(email => ({ email, permission: 'view' })));
    openShareList();
  };

  const handleAddUserToShare = () => {
    if (!shareWithEmail.trim()) return;
    
    const newUser = { email: shareWithEmail.trim(), permission: sharePermission };
    setSharedUsers(prev => [...prev, newUser]);
    setShareWithEmail('');
  };

  const handleRemoveUserFromShare = (email: string) => {
    setSharedUsers(prev => prev.filter(user => user.email !== email));
  };

  const handleUpdateUserPermission = (email: string, permission: 'view' | 'edit') => {
    setSharedUsers(prev => 
      prev.map(user => 
        user.email === email ? { ...user, permission } : user
      )
    );
  };

  const handleSaveSharing = () => {
    if (!sharingList) return;

    const updatedList: ProductList = {
      ...sharingList,
      isShared: sharedUsers.length > 0,
      sharedWith: sharedUsers.map(user => user.email),
      updatedDate: new Date(),
    };

    const updatedLists = productLists.map(list =>
      list.id === sharingList.id ? updatedList : list
    );
    onUpdateProductLists(updatedLists);

    // Reset form
    setSharingList(null);
    setSharedUsers([]);
    setShareWithEmail('');
    setSharePermission('view');
    closeShareList();
  };

  const isFavorite = (productId: string) => {
    return favoriteProducts.some(fav => fav.product.id === productId);
  };

  const getProductLists = (productId: string) => {
    const favorite = favoriteProducts.find(fav => fav.product.id === productId);
    if (!favorite) return [];
    
    return productLists.filter(list => favorite.customListIds.includes(list.id));
  };

  const FavoriteCard = ({ favorite }: { favorite: FavoriteProduct }) => {
    const { product } = favorite;
    const productLists = getProductLists(product.id);
    const isSelected = selectedProducts.includes(product.id);

    return (
      <Card withBorder h="100%">
        <Card.Section>
          <Group justify="space-between" p="xs">
            <Checkbox
              checked={isSelected}
              onChange={(e) => handleSelectProduct(product.id, e.currentTarget.checked)}
            />
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => handleToggleFavorite(product)}
            >
              <IconHeartFilled size={16} />
            </ActionIcon>
          </Group>
          <Image
            src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%23868e96'%3E${encodeURIComponent(product.name.substring(0, 20))}%3C/text%3E%3C/svg%3E`}
            alt={product.name}
            height={180}
            fit="contain"
          />
        </Card.Section>

        <Stack mt="md" justify="space-between" h="calc(100% - 220px)">
          <div>
            <Text fw={500} size="sm" lineClamp={2}>
              {product.name}
            </Text>
            <Badge size="xs" variant="light" mt="xs">
              {product.category}
            </Badge>

            <Text size="xs" c="dimmed" mt="xs" lineClamp={2}>
              {product.description}
            </Text>

            <Group justify="space-between" mt="md">
              <Text size="lg" fw={700} c="blue">
                <NumberFormatter value={product.dealerPrice} prefix="$" thousandSeparator />
              </Text>
              <Badge color={product.inStock ? 'green' : 'red'} variant="light">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </Group>

            {favorite.notes && (
              <Alert icon={<IconNotes size={16} />} variant="light" mt="xs">
                <Text size="xs">{favorite.notes}</Text>
              </Alert>
            )}

            {productLists.length > 0 && (
              <Group gap="xs" mt="xs">
                {productLists.map(list => (
                  <Badge key={list.id} size="xs" variant="outline">
                    {list.name}
                  </Badge>
                ))}
              </Group>
            )}
          </div>

          <Group justify="space-between">
            <Group gap="xs">
              <Tooltip label="Add Notes">
                <ActionIcon
                  variant="light"
                  onClick={() => handleAddNotes(favorite)}
                >
                  <IconNotes size={16} />
                </ActionIcon>
              </Tooltip>
              <Menu>
                <Menu.Target>
                  <ActionIcon variant="light">
                    <IconList size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Add to List</Menu.Label>
                  {productLists.map(list => (
                    <Menu.Item
                      key={list.id}
                      onClick={() => handleAddToList(list.id, product.id)}
                      disabled={list.productIds.includes(product.id)}
                    >
                      {list.name}
                    </Menu.Item>
                  ))}
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconFolderPlus size={16} />}
                    onClick={openCreateList}
                  >
                    Create New List
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
            <Group gap="xs">
              <Button size="xs" leftSection={<IconShoppingCart size={14} />}>
                Add to Cart
              </Button>
            </Group>
          </Group>
        </Stack>
      </Card>
    );
  };

  const ProductListCard = ({ list }: { list: ProductList }) => {
    const listProducts = products.filter(product => list.productIds.includes(product.id));

    return (
      <Card withBorder>
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Group justify="space-between">
              <Text fw={500}>{list.name}</Text>
              <Menu>
                <Menu.Target>
                  <ActionIcon variant="light">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEdit size={16} />}
                    onClick={() => handleEditList(list)}
                  >
                    Edit List
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconShare size={16} />}
                    onClick={() => handleShareList(list)}
                  >
                    Share List
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconTrash size={16} />}
                    color="red"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    Delete List
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            {list.category && (
              <Badge size="xs" variant="light" mt="xs">
                {list.category}
              </Badge>
            )}

            {list.description && (
              <Text size="sm" c="dimmed" mt="xs">
                {list.description}
              </Text>
            )}

            <Group mt="md">
              <Text size="sm" c="dimmed">
                {listProducts.length} products
              </Text>
              <Text size="sm" c="dimmed">
                Created {list.createdDate.toLocaleDateString()}
              </Text>
              {list.isShared && (
                <Badge size="xs" color="blue" variant="light">
                  Shared with {list.sharedWith.length} users
                </Badge>
              )}
            </Group>
          </div>
        </Group>

        {listProducts.length > 0 && (
          <Grid mt="md">
            {listProducts.slice(0, 4).map(product => (
              <Grid.Col key={product.id} span={3}>
                <Card withBorder p="xs">
                  <Image
                    src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='10' fill='%23868e96'%3EProduct%3C/text%3E%3C/svg%3E`}
                    alt={product.name}
                    height={60}
                    fit="contain"
                  />
                  <Text size="xs" mt="xs" lineClamp={2}>
                    {product.name}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
            {listProducts.length > 4 && (
              <Grid.Col span={3}>
                <Card withBorder p="xs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Text size="xs" c="dimmed" ta="center">
                    +{listProducts.length - 4} more
                  </Text>
                </Card>
              </Grid.Col>
            )}
          </Grid>
        )}
      </Card>
    );
  };

  return (
    <Stack>
      <Title order={2}>Product Favorites & Lists</Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="favorites" leftSection={<IconHeart size={16} />}>
            Favorites ({favoriteProducts.length})
          </Tabs.Tab>
          <Tabs.Tab value="lists" leftSection={<IconFolder size={16} />}>
            My Lists ({productLists.length})
          </Tabs.Tab>
          <Tabs.Tab value="shared" leftSection={<IconShare size={16} />}>
            Shared with Me (0)
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="favorites">
          <Stack mt="md">
            {/* Search and Filters */}
            <Card withBorder>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <TextInput
                    placeholder="Search favorites..."
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Select
                    placeholder="All Categories"
                    data={[{ value: '', label: 'All Categories' }, ...categories]}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Group>
                    <Button
                      leftSection={<IconFolderPlus size={16} />}
                      onClick={openCreateList}
                      disabled={selectedProducts.length === 0}
                    >
                      Create List ({selectedProducts.length})
                    </Button>
                    <Checkbox
                      label="Select All"
                      checked={selectedProducts.length === paginatedFavorites.length && paginatedFavorites.length > 0}
                      indeterminate={selectedProducts.length > 0 && selectedProducts.length < paginatedFavorites.length}
                      onChange={(e) => handleSelectAllProducts(e.currentTarget.checked)}
                    />
                  </Group>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Favorites Grid */}
            {paginatedFavorites.length > 0 ? (
              <>
                <Grid>
                  {paginatedFavorites.map((favorite) => (
                    <Grid.Col key={favorite.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                      <FavoriteCard favorite={favorite} />
                    </Grid.Col>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Group justify="center">
                    <Pagination
                      value={currentPage}
                      onChange={setCurrentPage}
                      total={totalPages}
                    />
                  </Group>
                )}
              </>
            ) : (
              <Text ta="center" c="dimmed" py="xl">
                {favoriteProducts.length === 0 
                  ? "No favorite products yet. Browse the catalog to add favorites!"
                  : "No favorites match your search criteria"
                }
              </Text>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="lists">
          <Stack mt="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Organize your favorite products into custom lists
              </Text>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={openCreateList}
              >
                Create New List
              </Button>
            </Group>

            {productLists.length > 0 ? (
              <Grid>
                {productLists.map((list) => (
                  <Grid.Col key={list.id} span={{ base: 12, md: 6 }}>
                    <ProductListCard list={list} />
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <Text ta="center" c="dimmed" py="xl">
                No product lists created yet. Create your first list to organize your favorites!
              </Text>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="shared">
          <Stack mt="md">
            <Text size="sm" c="dimmed">
              Product lists that have been shared with you by other team members
            </Text>

            <Alert icon={<IconAlertCircle size={16} />} variant="light">
              No lists have been shared with you yet. When team members share their product lists, they will appear here.
            </Alert>

            {/* Future implementation: Show shared lists here */}
            {/* This would typically come from an API that returns lists shared with the current user */}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Create/Edit List Modal */}
      <Modal
        opened={createListOpened || editListOpened}
        onClose={() => {
          closeCreateList();
          closeEditList();
          setEditingList(null);
          setNewListName('');
          setNewListDescription('');
          setNewListCategory('');
        }}
        title={editingList ? 'Edit Product List' : 'Create New Product List'}
      >
        <Stack>
          <TextInput
            label="List Name"
            placeholder="Enter list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Optional description"
            value={newListDescription}
            onChange={(e) => setNewListDescription(e.target.value)}
            rows={3}
          />
          <Select
            label="Category"
            placeholder="Optional category"
            data={listCategories}
            value={newListCategory}
            onChange={(value) => setNewListCategory(value || '')}
            searchable
          />
          <Group justify="flex-end">
            <Button
              variant="light"
              onClick={() => {
                closeCreateList();
                closeEditList();
                setEditingList(null);
                setNewListName('');
                setNewListDescription('');
                setNewListCategory('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingList ? handleUpdateList : handleCreateList}
              disabled={!newListName.trim()}
            >
              {editingList ? 'Update List' : 'Create List'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Add Notes Modal */}
      <Modal
        opened={addNotesOpened}
        onClose={closeAddNotes}
        title="Add Notes"
      >
        <Stack>
          <Textarea
            label="Notes"
            placeholder="Add notes about this product"
            value={favoriteNotes}
            onChange={(e) => setFavoriteNotes(e.target.value)}
            rows={4}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddNotes}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Share List Modal */}
      <Modal
        opened={shareListOpened}
        onClose={() => {
          closeShareList();
          setSharingList(null);
          setSharedUsers([]);
          setShareWithEmail('');
          setSharePermission('view');
        }}
        title={`Share "${sharingList?.name}" List`}
        size="md"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Share this product list with other users in your organization. You can control their permissions.
          </Text>

          {/* Add User Form */}
          <Card withBorder>
            <Stack>
              <Text fw={500} size="sm">Add User</Text>
              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    placeholder="Enter email address"
                    value={shareWithEmail}
                    onChange={(e) => setShareWithEmail(e.target.value)}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    data={[
                      { value: 'view', label: 'View Only' },
                      { value: 'edit', label: 'Can Edit' },
                    ]}
                    value={sharePermission}
                    onChange={(value) => setSharePermission(value as 'view' | 'edit')}
                  />
                </Grid.Col>
              </Grid>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={handleAddUserToShare}
                disabled={!shareWithEmail.trim()}
                size="sm"
              >
                Add User
              </Button>
            </Stack>
          </Card>

          {/* Shared Users List */}
          {sharedUsers.length > 0 && (
            <Card withBorder>
              <Stack>
                <Text fw={500} size="sm">Shared With</Text>
                {sharedUsers.map((user, index) => (
                  <Group key={index} justify="space-between">
                    <div>
                      <Text size="sm">{user.email}</Text>
                      <Badge size="xs" variant="light" color={user.permission === 'edit' ? 'blue' : 'gray'}>
                        {user.permission === 'edit' ? 'Can Edit' : 'View Only'}
                      </Badge>
                    </div>
                    <Group gap="xs">
                      <Select
                        data={[
                          { value: 'view', label: 'View Only' },
                          { value: 'edit', label: 'Can Edit' },
                        ]}
                        value={user.permission}
                        onChange={(value) => handleUpdateUserPermission(user.email, value as 'view' | 'edit')}
                        size="xs"
                        style={{ width: 120 }}
                      />
                      <ActionIcon
                        variant="light"
                        color="red"
                        size="sm"
                        onClick={() => handleRemoveUserFromShare(user.email)}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Group>
                  </Group>
                ))}
              </Stack>
            </Card>
          )}

          {sharedUsers.length === 0 && (
            <Alert icon={<IconAlertCircle size={16} />} variant="light">
              This list is not shared with anyone yet. Add users above to share it.
            </Alert>
          )}

          <Group justify="flex-end">
            <Button
              variant="light"
              onClick={() => {
                closeShareList();
                setSharingList(null);
                setSharedUsers([]);
                setShareWithEmail('');
                setSharePermission('view');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSharing}>
              Save Sharing Settings
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}