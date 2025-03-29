const fs = require('fs');
const path = require('path');

// 读取游戏数据
const gamesData = JSON.parse(fs.readFileSync('games_info.json', 'utf8'));
const templateHTML = fs.readFileSync('game-template.html', 'utf8');

// 创建游戏页面目录
const gameDir = path.join(__dirname, 'game');
if (!fs.existsSync(gameDir)) {
    fs.mkdirSync(gameDir);
}

// 为每个游戏生成详情页
gamesData.forEach(game => {
    let pageHTML = templateHTML;
    
    // 替换模板变量
    pageHTML = pageHTML.replace(/{{GAME_NAME}}/g, game.name);
    pageHTML = pageHTML.replace(/{{GAME_ID}}/g, game.id);
    pageHTML = pageHTML.replace(/{{GAME_DESCRIPTION}}/g, game.description);
    pageHTML = pageHTML.replace(/{{GAME_DESCRIPTION_SHORT}}/g, game.description.slice(0, 150) + '...');
    pageHTML = pageHTML.replace(/{{GAME_IMAGE}}/g, game.image_url || game.local_image_path);
    pageHTML = pageHTML.replace(/{{GAME_URL}}/g, game.textarea_link || game.url);
    pageHTML = pageHTML.replace(/{{GAME_CATEGORY}}/g, getGameCategory(game));
    pageHTML = pageHTML.replace(/{{GAME_CATEGORY_LOWERCASE}}/g, getGameCategory(game).toLowerCase());
    
    // 生成标签HTML
    const tagsHTML = (game.tags || []).map(tag => 
        `<span class="bg-gray-200 text-secondary px-3 py-1 rounded-full text-sm">${tag}</span>`
    ).join('');
    pageHTML = pageHTML.replace(/{{GAME_TAGS}}/g, tagsHTML);
    
    // 添加游戏控制信息（示例）
    const controlsHTML = `
        <li><strong>Mouse:</strong> Click to interact</li>
        <li><strong>WASD or Arrow Keys:</strong> Movement</li>
        <li><strong>Space:</strong> Jump/Action</li>
    `;
    pageHTML = pageHTML.replace(/{{GAME_CONTROLS}}/g, controlsHTML);
    
    // 添加游戏玩法说明（示例）
    pageHTML = pageHTML.replace(/{{GAME_HOW_TO_PLAY}}/g, 
        `Use your skills to progress through levels and achieve the highest score. Collect items, avoid obstacles, and defeat enemies.`);
    
    // 添加游戏信息
    pageHTML = pageHTML.replace(/{{GAME_ADDED_DATE}}/g, '2023-10-15');
    pageHTML = pageHTML.replace(/{{GAME_PLAY_COUNT}}/g, Math.floor(Math.random() * 10000));
    
    // 生成相似游戏推荐
    const similarGames = getSimilarGames(game, gamesData);
    const similarGamesHTML = similarGames.map(similarGame => createGameCard(similarGame)).join('');
    pageHTML = pageHTML.replace(/{{SIMILAR_GAMES}}/g, similarGamesHTML);
    
    // 写入文件
    fs.writeFileSync(path.join(gameDir, `${game.id}.html`), pageHTML);
});

function getGameCategory(game) {
    const tags = game.tags || [];
    if (tags.includes('horror')) return 'Horror';
    if (tags.includes('puzzle')) return 'Puzzle';
    if (tags.includes('shooting')) return 'Shooting';
    if (tags.includes('strategy')) return 'Strategy';
    if (tags.includes('sports')) return 'Sports';
    return 'Action';
}

function getSimilarGames(currentGame, allGames) {
    // 获取相同分类的其他游戏
    return allGames
        .filter(game => game.id !== currentGame.id && 
                       (game.tags || []).some(tag => (currentGame.tags || []).includes(tag)))
        .slice(0, 4);
} 