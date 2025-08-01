import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Animated,
    Modal,
    FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import NoiseOverlay from '@/components/noiseBackground';

const { width } = Dimensions.get('window');

const ForumScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [showSortModal, setShowSortModal] = useState(false);
    const [selectedHashtag, setSelectedHashtag] = useState('all');

    const [discussions] = useState([
        {
            id: 1,
            title: "CPR saved my neighbor's life today!",
            author: "Sarah Chen",
            authorBadge: "Tiger",
            content: "Thanks to the cardiac emergency training, I was able to perform CPR when my elderly neighbor collapsed...",
            hashtags: ["#CPRSaves", "#RealStory", "#Grateful"],
            likes: 234,
            comments: 45,
            timestamp: "2 hours ago",
            isPinned: true,
            category: "success-story"
        },
        {
            id: 2,
            title: "Quick tip: Remember the Heimlich position",
            author: "Dr. Mike Johnson",
            authorBadge: "Expert",
            content: "Place your fist just above the navel, not on the ribs. This common mistake can reduce effectiveness...",
            hashtags: ["#ChokingRelief", "#Tips", "#Safety"],
            likes: 189,
            comments: 23,
            timestamp: "5 hours ago",
            isExpert: true,
            category: "tips"
        },
        {
            id: 3,
            title: "Question about burn treatment",
            author: "Alex Rivera",
            authorBadge: "Beginner",
            content: "Should I use ice on a burn? I've heard conflicting advice about this...",
            hashtags: ["#Burns", "#Question", "#FirstAid"],
            likes: 56,
            comments: 67,
            timestamp: "1 day ago",
            hasAnswer: true,
            category: "question"
        },
        {
            id: 4,
            title: "New earthquake safety guidelines released",
            author: "Emergency Services",
            authorBadge: "Official",
            content: "The National Safety Council has updated the earthquake response protocols. Key changes include...",
            hashtags: ["#Earthquake", "#NaturalDisaster", "#Updates"],
            likes: 412,
            comments: 89,
            timestamp: "2 days ago",
            isOfficial: true,
            category: "announcement"
        },
        {
            id: 5,
            title: "My first aid kit essentials - what am I missing?",
            author: "Jamie Park",
            authorBadge: "Lion",
            content: "I've assembled my kit with bandages, antiseptic, gauze, and medications. What else should I include?",
            hashtags: ["#FirstAidKit", "#Preparation", "#Advice"],
            likes: 78,
            comments: 34,
            timestamp: "3 days ago",
            category: "discussion"
        }
    ]);

    const [trendingHashtags] = useState([
        { tag: "#CPRSaves", count: 1234 },
        { tag: "#FirstAid", count: 890 },
        { tag: "#NaturalDisaster", count: 567 },
        { tag: "#Tips", count: 456 },
        { tag: "#RealStory", count: 234 }
    ]);

    const sortOptions = [
        { value: 'recent', label: 'Most Recent', icon: 'schedule' },
        { value: 'popular', label: 'Most Popular', icon: 'trending-up' },
        { value: 'comments', label: 'Most Discussed', icon: 'forum' },
        { value: 'unanswered', label: 'Needs Answer', icon: 'help-outline' }
    ];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleDiscussionPress = (discussion) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('DiscussionDetail', { discussion });
    };

    const handleHashtagPress = (hashtag) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedHashtag(hashtag);
        setSearchQuery(hashtag);
    };

    const handleCreatePost = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('CreatePost');
    };

    const filteredDiscussions = discussions.filter(discussion => {
        if (searchQuery) {
            return discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   discussion.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return true;
    });

    const getCategoryColor = (category) => {
        switch(category) {
            case 'success-story': return '#2E7D32';
            case 'tips': return '#FF6F00';
            case 'question': return '#7B1FA2';
            case 'announcement': return '#BB2B29';
            case 'discussion': return '#0277BD';
            default: return '#666';
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient 
                colors={['#a60000ff', '#fcf4f4eb','#ffffff','#fdfbf9','#a60000ff']}
                style={StyleSheet.absoluteFill} 
                start={{ x:-1, y:1}}
                end={{x:1,y:1.4}}
            />
            <NoiseOverlay opacity={1.9} />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <LinearGradient
                        colors={['#BB2B29', '#ffffff', '#BB2B29']}
                        style={styles.searchGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}>
                        <NoiseOverlay opacity={0.5} />
                        
                        <View style={styles.searchInputContainer}>
                            <MaterialIcons name="search" size={24} color="#666" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search discussions or #hashtags..."
                                placeholderTextColor="#999"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <MaterialIcons name="close" size={20} color="#666" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </LinearGradient>
                </View>

                {/* Trending Hashtags */}
                <View style={styles.hashtagsSection}>
                    <Text style={styles.sectionTitle}>Trending Topics</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.hashtagsScroll}>
                        {trendingHashtags.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.hashtagChip,
                                    selectedHashtag === item.tag && styles.selectedHashtagChip
                                ]}
                                onPress={() => handleHashtagPress(item.tag)}>
                                <Text style={[
                                    styles.hashtagText,
                                    selectedHashtag === item.tag && styles.selectedHashtagText
                                ]}>
                                    {item.tag}
                                </Text>
                                <Text style={styles.hashtagCount}>{item.count}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Sort and Filter Bar */}
                <View style={styles.filterBar}>
                    <TouchableOpacity 
                        style={styles.sortButton}
                        onPress={() => setShowSortModal(true)}>
                        <MaterialIcons name="sort" size={20} color="#BB2B29" />
                        <Text style={styles.sortButtonText}>
                            {sortOptions.find(opt => opt.value === sortBy)?.label}
                        </Text>
                        <MaterialIcons name="arrow-drop-down" size={20} color="#BB2B29" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.createButton}
                        onPress={handleCreatePost}>
                        <MaterialIcons name="add" size={20} color="#fff" />
                        <Text style={styles.createButtonText}>New Post</Text>
                    </TouchableOpacity>
                </View>

                {/* Discussions List */}
                <Animated.View style={{ opacity: fadeAnim }}>
                    {filteredDiscussions.map((discussion) => (
                        <TouchableOpacity
                            key={discussion.id}
                            style={styles.discussionCard}
                            onPress={() => handleDiscussionPress(discussion)}
                            activeOpacity={0.8}>
                            
                            <LinearGradient
                                colors={['#ffffff', '#ffffff']}
                                style={styles.cardGradient}>
                                <NoiseOverlay opacity={0.3} />
                                
                                {/* Pinned/Official Badge */}
                                {(discussion.isPinned || discussion.isOfficial) && (
                                    <View style={styles.cardBadge}>
                                        <MaterialIcons 
                                            name={discussion.isPinned ? "push-pin" : "verified"} 
                                            size={16} 
                                            color="#fff" 
                                        />
                                        <Text style={styles.badgeText}>
                                            {discussion.isPinned ? "Pinned" : "Official"}
                                        </Text>
                                    </View>
                                )}

                                {/* Author Info */}
                                <View style={styles.authorRow}>
                                    <View style={[
                                        styles.authorAvatar,
                                        discussion.isExpert && styles.expertAvatar,
                                        discussion.isOfficial && styles.officialAvatar
                                    ]}>
                                        <Text style={styles.avatarText}>
                                            {discussion.author.split(' ').map(n => n[0]).join('')}
                                        </Text>
                                    </View>
                                    <View style={styles.authorInfo}>
                                        <Text style={styles.authorName}>{discussion.author}</Text>
                                        <View style={styles.authorMeta}>
                                            <View style={[
                                                styles.badgeContainer,
                                                { backgroundColor: getCategoryColor(discussion.category) + '20' }
                                            ]}>
                                                <Text style={[
                                                    styles.badgeLabel,
                                                    { color: getCategoryColor(discussion.category) }
                                                ]}>
                                                    {discussion.authorBadge}
                                                </Text>
                                            </View>
                                            <Text style={styles.timestamp}>{discussion.timestamp}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Content */}
                                <Text style={styles.discussionTitle}>{discussion.title}</Text>
                                <Text style={styles.discussionContent} numberOfLines={2}>
                                    {discussion.content}
                                </Text>

                                {/* Hashtags */}
                                <View style={styles.hashtagsRow}>
                                    {discussion.hashtags.map((tag, index) => (
                                        <Text key={index} style={styles.hashtag}>{tag}</Text>
                                    ))}
                                </View>

                                {/* Engagement Stats */}
                                <View style={styles.engagementRow}>
                                    <TouchableOpacity style={styles.engagementItem}>
                                        <MaterialIcons name="favorite-border" size={20} color="#BB2B29" />
                                        <Text style={styles.engagementText}>{discussion.likes}</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={styles.engagementItem}>
                                        <MaterialIcons name="comment" size={20} color="#666" />
                                        <Text style={styles.engagementText}>{discussion.comments}</Text>
                                    </TouchableOpacity>

                                    {discussion.hasAnswer && (
                                        <View style={styles.answeredBadge}>
                                            <MaterialIcons name="check-circle" size={16} color="#2E7D32" />
                                            <Text style={styles.answeredText}>Answered</Text>
                                        </View>
                                    )}
                                    
                                    <TouchableOpacity style={styles.shareButton}>
                                        <MaterialIcons name="share" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </ScrollView>

            {/* Sort Modal */}
            <Modal
                visible={showSortModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowSortModal(false)}>
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSortModal(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sort By</Text>
                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.sortOption,
                                    sortBy === option.value && styles.selectedSortOption
                                ]}
                                onPress={() => {
                                    setSortBy(option.value);
                                    setShowSortModal(false);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}>
                                <MaterialIcons 
                                    name={option.icon} 
                                    size={24} 
                                    color={sortBy === option.value ? '#BB2B29' : '#666'} 
                                />
                                <Text style={[
                                    styles.sortOptionText,
                                    sortBy === option.value && styles.selectedSortText
                                ]}>
                                    {option.label}
                                </Text>
                                {sortBy === option.value && (
                                    <MaterialIcons name="check" size={20} color="#BB2B29" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 50,
        paddingBottom: 100,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 32,
        color: "#4b4949ff",
        fontFamily: "PoppinsBold",
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#666",
        fontFamily: "PoppinsRegular",
    },
    searchContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: -20,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 8,
    },
    searchGradient: {
        borderWidth: 3,
        borderColor: "#931111ff",
        borderRadius: 15,
        padding: 2,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontFamily: 'PoppinsRegular',
        marginLeft: 10,
    },
    hashtagsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        color: "#4b4949ff",
        fontFamily: "PoppinsMedium",
        marginBottom: 10,
        marginLeft: 25,
    },
    hashtagsScroll: {
        paddingHorizontal: 20,
    },
    hashtagChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE5E5',
        borderWidth: 2,
        borderColor: '#BB2B29',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
    },
    selectedHashtagChip: {
        backgroundColor: '#BB2B29',
    },
    hashtagText: {
        fontSize: 14,
        color: '#BB2B29',
        fontFamily: 'PoppinsMedium',
        marginRight: 5,
    },
    selectedHashtagText: {
        color: '#fff',
    },
    hashtagCount: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'PoppinsRegular',
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#BB2B29',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    sortButtonText: {
        fontSize: 14,
        color: '#BB2B29',
        fontFamily: 'PoppinsRegular',
        marginHorizontal: 5,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFC107',
        borderWidth: 2,
        borderColor: '#F57C00',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        elevation: 3,
    },
    createButtonText: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'PoppinsBold',
        marginLeft: 5,
    },
    discussionCard: {
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 8,
    },
    cardGradient: {
        borderWidth: 3,
        borderColor: '#530404',
        borderRadius: 15,
        padding: 15,
        position: 'relative',
    },
    cardBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#BB2B29',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeText: {
        fontSize: 11,
        color: '#fff',
        fontFamily: 'PoppinsBold',
        marginLeft: 4,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    authorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#BB2B29',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    expertAvatar: {
        backgroundColor: '#FF6F00',
    },
    officialAvatar: {
        backgroundColor: '#2E7D32',
    },
    avatarText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'PoppinsBold',
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'PoppinsBold',
    },
    authorMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
    },
    badgeLabel: {
        fontSize: 11,
        fontFamily: 'PoppinsMedium',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'PoppinsRegular',
    },
    discussionTitle: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'PoppinsBold',
        marginBottom: 8,
        lineHeight: 24,
    },
    discussionContent: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'PoppinsRegular',
        lineHeight: 20,
        marginBottom: 10,
    },
    hashtagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    hashtag: {
        fontSize: 13,
        color: '#7B1FA2',
        fontFamily: 'PoppinsRegular',
        marginRight: 10,
        marginBottom: 5,
    },
    engagementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    engagementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    engagementText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'PoppinsRegular',
        marginLeft: 5,
    },
    answeredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 'auto',
        marginRight: 10,
    },
    answeredText: {
        fontSize: 12,
        color: '#2E7D32',
        fontFamily: 'PoppinsMedium',
        marginLeft: 4,
    },
    shareButton: {
        marginLeft: 'auto',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 20,
        color: '#333',
        fontFamily: 'PoppinsBold',
        marginBottom: 20,
        textAlign: 'center',
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    selectedSortOption: {
        backgroundColor: '#FFE5E5',
    },
    sortOptionText: {
        flex: 1,
        fontSize: 16,
        color: '#666',
        fontFamily: 'PoppinsRegular',
        marginLeft: 15,
    },
    selectedSortText: {
        color: '#BB2B29',
        fontFamily: 'PoppinsBold',
    },
});

export default ForumScreen;